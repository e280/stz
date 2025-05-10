
import {Hex} from "../hex.js"
import {Base58} from "../base58.js"
import {Bytename} from "./bytename.js"

export type ThumbprintOptions = {
	delimiter: string
	sigilBytes: number
	previewBytes: number
}

export type ThumbprintData = {
	bytes: Uint8Array
	thumbprint: string
	preview: string
	bulk: string
	sigil: string
}

/**
 * Thumbprint is a friendly presentation format for arbitrary binary data.
 *  - looks like "nodlyn.fasrep.habbud.ralwel.Avo7gFmdWMRHkwsD149mcaBoZdS69iXuJ"
 *  - the "sigil" is the first bytes that are shown in bytename format
 *  - the "bulk" is the rest of the data in base58
 *  - originally designed to be a nice way to present 256-bit ids
 *  - can actually represent any number of bytes
 */
export const Thumbprint = {
	defaults: (<ThumbprintOptions>{
		delimiter: ".",
		sigilBytes: 4,
		previewBytes: 8,
	}),

	toBytes(thumbprint: string) {
		thumbprint = thumbprint.trim()
		const beans = thumbprint.split(/[^a-zA-Z0-9]+/m)
			.filter(Boolean)
			.map(s => s.trim())

		if (beans.length < 2)
			return Bytename.toBytes(beans.join(""))

		const bulk = beans.pop()!
		const preview = beans.join("")

		return new Uint8Array([
			...Bytename.toBytes(preview),
			...Base58.bytes(bulk),
		])
	},

	parse(thumbprint: string, options?: Partial<ThumbprintOptions>): ThumbprintData {
		const bytes = Thumbprint.toBytes(thumbprint)
		return Thumbprint.build.fromBytes(bytes, options)
	},

	build: {
		fromBytes(bytes: Uint8Array, options: Partial<ThumbprintOptions> = {}): ThumbprintData {
			const {delimiter, previewBytes, sigilBytes}
				= {...Thumbprint.defaults, ...options}

			const yoink = (b: number) => (bytes.length > 0)
				? Bytename.fromBytes(bytes.slice(0, b), {
					wordSeparator: delimiter,
					groupSeparator: delimiter,
				})
				: ""

			const sigil = yoink(sigilBytes)
			const preview = yoink(previewBytes)

			const bulk = (bytes.length > previewBytes)
				? Base58.string(bytes.slice(previewBytes))
				: ""

			const thumbprint = [preview, bulk]
				.filter(s => s.length > 0)
				.join(delimiter)

			return {bytes, thumbprint, preview, bulk, sigil}
		},

		fromHex(hex: string, options?: Partial<ThumbprintOptions>) {
			const bytes = Hex.bytes(hex)
			return Thumbprint.build.fromBytes(bytes, options)
		},
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

