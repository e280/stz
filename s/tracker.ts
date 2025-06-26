
export class Tracker<T = any> {
	#set = new Set<T>()

	touch(trackable: T) {
		this.#set.add(trackable)
	}

	observe(fn: () => void): Set<T> {
		fn()
		const set = this.#set
		this.#set = new Set()
		return set
	}
}

export const tracker = new Tracker()

