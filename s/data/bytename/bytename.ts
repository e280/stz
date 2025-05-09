
import {Hex} from "../hex.js"
import {Bytes} from "../bytes.js"
import {prefixes} from "./utils/prefixes.js"
import {suffixes} from "./utils/suffixes.js"

export type BytenameOptions = {
	groupSize: number
	wordSeparator: string
	groupSeparator: string
}

/**
 * Bytename is a friendly presentation format for arbitrary binary data.
 *  - looks like "midsen.picmyn.widrep.baclut dotreg.filtyp.nosnus.siptev"
 *  - each byte maps to a three-letter triplet
 *  - all delimiters are just sugar, parser doesn't care
 */
export const Bytename = {
	defaults: (<BytenameOptions>{
		groupSize: 4,
		wordSeparator: ".",
		groupSeparator: " ",
	}),

	random(byteCount: number, options?: Partial<BytenameOptions>) {
		const bytes = Bytes.random(byteCount)
		return this.fromBytes(bytes, options)
	},

	fromBytes(bytes: Uint8Array, options: Partial<BytenameOptions> = {}) {
		const {
			groupSize = Bytename.defaults.groupSize,
			wordSeparator = Bytename.defaults.wordSeparator,
			groupSeparator = Bytename.defaults.groupSeparator,
		} = options

		const words: string[] = []
		let currentWord: string[] = []

		bytes.forEach((byte, index) => {
			const source = ((index % 2) === 0) ? prefixes : suffixes
			currentWord.push(source[byte]!)
			if (currentWord.length === 2) {
				words.push(currentWord.join(""))
				currentWord = []
			}
		})

		if (currentWord.length)
			words.push(currentWord.join(""))

		const grouped = []
		for (let i = 0; i < words.length; i += groupSize)
			grouped.push(words.slice(i, i + groupSize).join(wordSeparator))

		return grouped.join(groupSeparator)
	},

	toBytes(bytename: string) {
		const letters = bytename
			.toLowerCase()
			.replace(/[^a-z]/g, "") // strip everything except letters

		const count = letters.length / 3
		if ((count % 1) !== 0)
			throw new Error(`invalid triplet count, ${letters.length} does not divide into triplets`)

		const triplets: string[] = []
		for (let i = 0; i < letters.length; i += 3)
			triplets.push(letters.slice(i, i + 3))

		return new Uint8Array(triplets.map((triplet, index) => {
			const source = ((index % 2) === 0) ? prefixes : suffixes
			const number = source.findIndex(t => t === triplet)
			if (number === -1)
				throw new Error(`unknown triplet ${triplet}`)
			return number
		}))
	},

	toHex(bytename: string) {
		return Hex.string(Bytename.toBytes(bytename))
	},

	fromHex(hex: string, options?: Partial<BytenameOptions>) {
		return Bytename.fromBytes(Hex.bytes(hex), options)
	},

	/** @deprecated renamed to `fromBytes` */
	string(bytes: Uint8Array, options: Partial<BytenameOptions> = {}) { return Bytename.fromBytes(bytes, options) },

	/** @deprecated renamed to `toBytes` */
	bytes(bytename: string) { return Bytename.toBytes(bytename) },

	/** @deprecated renamed to `toHex` */
	hex(bytename: string) { return Bytename.toHex(bytename) },
}

