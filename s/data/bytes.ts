
export const bytes = Object.freeze({
	eq(a: Uint8Array, b: Uint8Array) {
		if (a.length !== b.length) return false
		let diff = 0
		for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
		return diff === 0
	},

	random(count: number) {
		return crypto.getRandomValues(new Uint8Array(count))
	},
})

/** @deprecated renamed to `bytes` */
export const Bytes = bytes

