
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

	concat(parts: Uint8Array[]) {
		let size = 0
		for (const part of parts) size += part.byteLength

		const bytes = new Uint8Array(size)

		let offset = 0
		for (const part of parts) {
			bytes.set(part, offset)
			offset += part.byteLength
		}

		return bytes as Uint8Array
	},
})

