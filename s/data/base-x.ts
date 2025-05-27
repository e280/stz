
import {Bytes} from "./bytes.js"

export type Lexicon = {
	characters: string
	padding?: {
		character: string
		size: number
	}
}

export class BaseX {
	static lexicons = Object.freeze({
		base2: {characters: "01"},
		hex: {characters: "0123456789abcdef"},
		base36: {characters: "0123456789abcdefghijklmnopqrstuvwxyz"},
		base58: {characters: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"},
		base62: {characters: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"},
		base64url: {characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"},
		base64: {
			characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
			padding: {character: "=", size: 4},
		},
	})

	private lookup: Record<string, number>

	constructor(public lexicon: Lexicon) {
		this.lookup = Object.fromEntries(
			[...lexicon.characters].map((char, i) => [char, i])
		)
	}

	toBytes(s: string): Uint8Array {
		const bitsPerChar = Math.log2(this.lexicon.characters.length)
		if (Number.isInteger(bitsPerChar)) {
			// Bitstream mode (for power-of-2 lexicons)
			let bitBuffer = 0
			let bitCount = 0
			const output: number[] = []

			for (const char of s) {
				if (char === this.lexicon.padding?.character) continue
				const val = this.lookup[char]
				if (val === undefined) throw new Error(`Invalid character: ${char}`)
				bitBuffer = (bitBuffer << bitsPerChar) | val
				bitCount += bitsPerChar

				while (bitCount >= 8) {
					bitCount -= 8
					output.push((bitBuffer >> bitCount) & 0xFF)
				}
			}

			return new Uint8Array(output)
		}

		// Radix mode fallback
		let num = 0n
		const base = BigInt(this.lexicon.characters.length)
		for (const char of s) {
			const val = this.lookup[char]
			if (val === undefined) throw new Error(`Invalid character: ${char}`)
			num = num * base + BigInt(val)
		}
		const out: number[] = []
		while (num > 0n) {
			out.unshift(Number(num % 256n))
			num = num / 256n
		}
		return new Uint8Array(out)
	}

	fromBytes(bytes: Uint8Array): string {
		const bitsPerChar = Math.log2(this.lexicon.characters.length)
		if (Number.isInteger(bitsPerChar)) {
			// Bitstream mode (for power-of-2 lexicons)
			let bitBuffer = 0
			let bitCount = 0
			let out = ""

			for (const byte of bytes) {
				bitBuffer = (bitBuffer << 8) | byte
				bitCount += 8

				while (bitCount >= bitsPerChar) {
					bitCount -= bitsPerChar
					const index = (bitBuffer >> bitCount) & ((1 << bitsPerChar) - 1)
					out += this.lexicon.characters[index]
				}
			}

			// 🩹 flush remaining bits
			if (bitCount > 0) {
				const index = (bitBuffer << (bitsPerChar - bitCount)) & ((1 << bitsPerChar) - 1)
				out += this.lexicon.characters[index]
			}

			// Add padding if applicable
			if (this.lexicon.padding) {
				while (out.length % this.lexicon.padding.size !== 0)
					out += this.lexicon.padding.character
			}

			return out
		}

		// Radix mode fallback
		let num = 0n
		for (const byte of bytes)
			num = (num << 8n) + BigInt(byte)

		if (num === 0n) return this.lexicon.characters[0]

		const base = BigInt(this.lexicon.characters.length)
		let out = ""
		while (num > 0n) {
			out = this.lexicon.characters[Number(num % base)] + out
			num = num / base
		}
		return out
	}

	toInteger(s: string) {
		let n = 0n
		const base = BigInt(this.lexicon.characters.length)
		for (const char of s) {
			const value = this.lookup[char]
			if (value === undefined) throw new Error(`Invalid character: ${char}`)
			n = n * base + BigInt(value)
		}
		return Number(n)
	}

	fromInteger(n: number) {
		n = Math.floor(n)
		let num = BigInt(n)
		if (num === 0n) return this.lexicon.characters[0]
		const base = BigInt(this.lexicon.characters.length)
		let out = ""
		while (num > 0n) {
			out = this.lexicon.characters[Number(num % base)] + out
			num = num / base
		}
		return out
	}

	random(count = 32) {
		return this.fromBytes(Bytes.random(count))
	}
}

