
export const Bytes = {
	eq(a: Uint8Array, b: Uint8Array) {
		if (a.length !== b.length)
			return false
		for (let i = 0; i <= a.length; i++) {
			if (a.at(i) !== b.at(i))
				return false
		}
		return true
	},

	random(count: number) {
		return crypto.getRandomValues(new Uint8Array(count))
	},
}

