
import {bytes} from "../bytes.js"
import {hex} from "../base-x-codecs.js"
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
export const bytename = {
	defaults: (<BytenameOptions>{
		groupSize: 4,
		wordSeparator: ".",
		groupSeparator: " ",
	}),

	random(byteCount: number, options?: Partial<BytenameOptions>) {
		const b = bytes.random(byteCount)
		return this.fromBytes(b, options)
	},

	fromBytes(b: Uint8Array, options: Partial<BytenameOptions> = {}) {
		const {
			groupSize = bytename.defaults.groupSize,
			wordSeparator = bytename.defaults.wordSeparator,
			groupSeparator = bytename.defaults.groupSeparator,
		} = options

		const words: string[] = []
		let currentWord: string[] = []

		b.forEach((byte, index) => {
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

	toBytes(bname: string) {
		const letters = bname
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

	toHex(bname: string) {
		return hex.fromBytes(bytename.toBytes(bname))
	},

	fromHex(h: string, options?: Partial<BytenameOptions>) {
		return bytename.fromBytes(hex.toBytes(h), options)
	},
}

/** @deprecated renamed to `bytename` */
export const Bytename = bytename

