
import {Hex} from "../hex.js"
import {Base58} from "../base58.js"
import {Bytename} from "./bytename.js"

export type ThumbprintOptions = {
	delimiter: string
	sigilDelimiter: string
	sigilByteCount: number
}

export type ThumbprintData = {
	bytes: Uint8Array
	sigil: string
	bulk: string
	thumbprint: string
}

/**
 * Thumbprint is a friendly presentation format for arbitrary binary data.
 *  - looks like "nodlyn.fasrep.habbud.ralwel::Avo7gFmdWMRHkwsD149mcaBoZdS69iXuJ"
 *  - the "sigil" is the first bytes that are shown in bytename format
 *  - the "bulk" is the rest of the data in base58
 *  - originally designed to be a nice way to present 256-bit ids
 *  - can actually represent any number of bytes
 */
export const Thumbprint = {
	defaults: (<ThumbprintOptions>{
		delimiter: "::",
		sigilDelimiter: ".",
		sigilByteCount: 6,
	}),

	parse(thumbprint: string): ThumbprintData {
		thumbprint = thumbprint.trim()
		const parts = thumbprint.split(/[^a-zA-Z0-9]+/m)
			.filter(Boolean)
			.map(s => s.trim())

		if (parts.length < 2) {
			const sigil = parts.join(".")
			const bytes = Bytename.toBytes(sigil)
			return {bytes, sigil, bulk: "", thumbprint}
		}

		const bulk = parts.pop()!
		const sigil = parts.join(".")
		const bytes = new Uint8Array([
			...Bytename.toBytes(sigil),
			...Base58.bytes(bulk),
		])

		return {bytes, sigil, bulk, thumbprint}
	},

	build: {
		fromBytes(bytes: Uint8Array, options: Partial<ThumbprintOptions> = {}): ThumbprintData {
			const {sigilByteCount, sigilDelimiter, delimiter}
				= {...Thumbprint.defaults, ...options}

			const sigil = (bytes.length > 0)
				? Bytename.fromBytes(bytes.slice(0, sigilByteCount), {
					wordSeparator: sigilDelimiter,
					groupSeparator: sigilDelimiter,
				})
				: ""

			const bulk = (bytes.length > sigilByteCount)
				? Base58.string(bytes.slice(sigilByteCount))
				: ""

			const thumbprint = [sigil, bulk]
				.filter(s => s.length > 0)
				.join(delimiter)

			return {bytes, sigil, bulk, thumbprint}
		},

		fromHex(hex: string, options?: Partial<ThumbprintOptions>) {
			const bytes = Hex.bytes(hex)
			return Thumbprint.build.fromBytes(bytes, options)
		},
	},

	toBytes(thumbprint: string) {
		return Thumbprint.parse(thumbprint).bytes
	},

	toHex(thumbprint: string) {
		const bytes = Thumbprint.toBytes(thumbprint)
		return Hex.string(bytes)
	},

	fromBytes(bytes: Uint8Array, options?: Partial<ThumbprintOptions>) {
		return Thumbprint.build.fromBytes(bytes, options).thumbprint
	},

	fromHex(hex: string, options?: Partial<ThumbprintOptions>) {
		return Thumbprint.fromBytes(Hex.bytes(hex), options)
	},

	sigil: {
		fromHex(hex: string, options?: Partial<ThumbprintOptions>) {
			return Thumbprint.build.fromHex(hex, options).sigil
		},
		fromBytes(bytes: Uint8Array, options?: Partial<ThumbprintOptions>) {
			return Thumbprint.build.fromBytes(bytes, options).sigil
		},
	},
}

