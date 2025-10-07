
import {bytename} from "./bytename.js"
import {base58, hex} from "../base-x-codecs.js"

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
 *  - the preview: "nodlyn.fasrep.habbud.ralwel" (bytename format)
 *  - the bulk: "Avo7gFmdWMRHkwsD149mcaBoZdS69iXuJ" (base58 format)
 *  - the sigil: "nodlyn.fasrep" (shorter part of the bytename)
 *  - originally designed to be a nice way to present 256-bit ids, but can actually represent any number of bytes
 */
export const thumbprint = {
	defaults: (<ThumbprintOptions>{
		delimiter: ".",
		sigilBytes: 4,
		previewBytes: 8,
	}),

	toBytes(tstring: string) {
		tstring = tstring.trim()
		const beans = tstring.split(/[^a-zA-Z0-9]+/m)
			.filter(Boolean)
			.map(s => s.trim())

		if (beans.length < 2)
			return bytename.toBytes(beans.join(""))

		const bulk = beans.pop()!
		const preview = beans.join("")

		return new Uint8Array([
			...bytename.toBytes(preview),
			...base58.toBytes(bulk),
		])
	},

	parse(tstring: string, options?: Partial<ThumbprintOptions>): ThumbprintData {
		const bytes = thumbprint.toBytes(tstring)
		return thumbprint.build.fromBytes(bytes, options)
	},

	build: {
		fromBytes(b: Uint8Array, options: Partial<ThumbprintOptions> = {}): ThumbprintData {
			const {delimiter, previewBytes, sigilBytes}
				= {...thumbprint.defaults, ...options}

			const yoink = (len: number) => (b.length > 0)
				? bytename.fromBytes(b.slice(0, len), {
					wordSeparator: delimiter,
					groupSeparator: delimiter,
				})
				: ""

			const sigil = yoink(sigilBytes)
			const preview = yoink(previewBytes)

			const bulk = (b.length > previewBytes)
				? base58.fromBytes(b.slice(previewBytes))
				: ""

			const tstring = [preview, bulk]
				.filter(s => s.length > 0)
				.join(delimiter)

			return {bytes: b, thumbprint: tstring, preview, bulk, sigil}
		},

		fromHex(hstring: string, options?: Partial<ThumbprintOptions>) {
			const bytes = hex.toBytes(hstring)
			return thumbprint.build.fromBytes(bytes, options)
		},
	},

	toHex(tstring: string) {
		const bytes = thumbprint.toBytes(tstring)
		return hex.fromBytes(bytes)
	},

	fromBytes(b: Uint8Array, options?: Partial<ThumbprintOptions>) {
		return thumbprint.build.fromBytes(b, options).thumbprint
	},

	fromHex(h: string, options?: Partial<ThumbprintOptions>) {
		return thumbprint.fromBytes(hex.toBytes(h), options)
	},

	sigil: {
		fromHex(h: string, options?: Partial<ThumbprintOptions>) {
			return thumbprint.build.fromHex(h, options).sigil
		},
		fromBytes(b: Uint8Array, options?: Partial<ThumbprintOptions>) {
			return thumbprint.build.fromBytes(b, options).sigil
		},
	},
}

/** @deprecated renamed to `thumbprint` */
export const Thumbprint = thumbprint

