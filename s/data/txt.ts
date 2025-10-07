
export const txt = Object.freeze({
	fromBytes(bytes: Uint8Array) {
		return new TextDecoder().decode(bytes)
	},

	toBytes(string: string) {
		return new TextEncoder().encode(string)
	},

	/** @deprecated renamed to `fromBytes` */
	string(bytes: Uint8Array) {
		return txt.fromBytes(bytes)
	},

	/** @deprecated renamed to `toBytes` */
	bytes(string: string) {
		return txt.toBytes(string)
	},
})

/** @deprecated renamed to `txt` */
export const Txt = txt

