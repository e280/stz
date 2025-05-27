
import {Bytes} from "./bytes.js"

export class BaseX {
	static lexicons = Object.freeze({
		base2: "01",
		hex: "0123456789abcdef",
		base36: "0123456789abcdefghijklmnopqrstuvwxyz",
		base58: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
		base62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	})

	private base: bigint
	private lookup: Record<string, bigint>

	constructor(public lexicon: string) {
		this.base = BigInt(lexicon.length)
		this.lookup = Object.fromEntries(
			[...lexicon].map((char, i) => [char, BigInt(i)])
		)
	}

	toInteger(s: string) {
		let n = BigInt(0)
		for (const char of s) {
			const value = this.lookup[char]
			if (value === undefined) throw new Error(`Invalid character: ${char}`)
			n = n * this.base + value
		}
		return Number(n)
	}

	fromInteger(n: number) {
		n = Math.floor(n)
		let num = BigInt(n)
		if (num === 0n) return this.lexicon[0]
		let out = ""
		while (num > 0n) {
			out = this.lexicon[Number(num % this.base)] + out
			num = num / this.base
		}
		return out
	}

	toBytes(s: string): Uint8Array {
		let num = BigInt(0)
		for (const char of s) {
			const value = this.lookup[char]
			if (value === undefined) throw new Error(`Invalid character: ${char}`)
			num = num * this.base + value
		}
		const out: number[] = []
		while (num > 0n) {
			out.unshift(Number(num % 256n))
			num = num / 256n
		}
		return new Uint8Array(out)
	}

	fromBytes(bytes: Uint8Array): string {
		let num = BigInt(0)
		for (const byte of bytes)
			num = (num << 8n) + BigInt(byte)

		if (num === 0n) return this.lexicon[0]

		let out = ""
		while (num > 0n) {
			out = this.lexicon[Number(num % this.base)] + out
			num = num / this.base
		}
		return out
	}

	random(count = 32) {
		return this.fromBytes(Bytes.random(count))
	}
}

