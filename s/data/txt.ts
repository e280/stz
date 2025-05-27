
export const Txt = Object.freeze({
	fromBytes(bytes: Uint8Array) {
		return new TextDecoder().decode(bytes)
	},

	toBytes(string: string) {
		return new TextEncoder().encode(string)
	},

	/** @deprecated renamed to `fromBytes` */
	string(bytes: Uint8Array) {
		return Txt.fromBytes(bytes)
	},

	/** @deprecated renamed to `toBytes` */
	bytes(string: string) {
		return Txt.toBytes(string)
	},
})

