
import {Hex} from "../hex.js"
import {Base58} from "../base58.js"
import {Bytename} from "./bytename.js"

export type ThumbprintOptions = {
	delimiter: string
	sigilDelimiter: string
	sigilByteCount: number
}

export type ThumbprintData = {
	sigil: string
	bulk: string
	bytes: Uint8Array
}

/**
 * Thumbprint is a human-friendly presentation format for arbitrary binary data.
 *  - looks like "nodlyn.fasrep::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"
 *  - the first lead bytes are shown in bytename format
 *  - the rest of the data is in base58
 *  - designed to be a nice way to present 256-bit passport thumbprints
 *  - can actually represent any number of bytes
 */
export const Thumbprint = {
	defaults: (<ThumbprintOptions>{
		delimiter: "::",
		sigilDelimiter: ".",
		sigilByteCount: 4,
	}),

	string(bytes: Uint8Array, options: Partial<ThumbprintOptions> = {}) {
		const {sigilByteCount, sigilDelimiter, delimiter}
			= {...Thumbprint.defaults, ...options}

		const sigil = Bytename.string(bytes.slice(0, sigilByteCount), {
			wordSeparator: sigilDelimiter,
			groupSeparator: sigilDelimiter,
		})

		return (bytes.length > sigilByteCount)
			? `${sigil}${delimiter}${Base58.string(bytes.slice(sigilByteCount))}`
			: sigil
	},

	parse(thumbprint: string): ThumbprintData {
		thumbprint = thumbprint.trim()
		const parts = thumbprint.split(/[^a-zA-Z0-9]+/m)
			.filter(Boolean)
			.map(s => s.trim())

		if (parts.length < 2) {
			const sigil = parts.join(".")
			const bytes = Bytename.bytes(sigil)
			return {sigil, bulk: "", bytes}
		}

		const bulk = parts.pop()!
		const sigil = parts.join(".")
		const bytes = new Uint8Array([
			...Bytename.bytes(sigil),
			...Base58.bytes(bulk),
		])
		return {sigil, bulk, bytes}
	},

	bytes(thumbprint: string) {
		return Thumbprint.parse(thumbprint).bytes
	},

	hex(thumbprint: string) {
		return Hex.string(Thumbprint.bytes(thumbprint))
	},

	fromHex(hex: string, options?: Partial<ThumbprintOptions>) {
		return Thumbprint.string(Hex.bytes(hex), options)
	},
}

