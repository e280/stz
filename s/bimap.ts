
export class Bimap<K, V> extends Map<K, V> {
	#keys = new Map<V, K>()

	constructor(entries?: Iterable<readonly [K, V]> | null) {
		super()
		if (entries)
			for (const [key, value] of entries)
				this.set(key, value)
	}

	keyOf(value: V) {
		return this.#keys.get(value)
	}

	override set(key: K, value: V) {
		if (this.has(key))
			this.#keys.delete(this.get(key)!)

		if (this.#keys.has(value))
			super.delete(this.#keys.get(value)!)

		super.set(key, value)
		this.#keys.set(value, key)
		return this
	}

	override delete(key: K) {
		if (!this.has(key)) return false
		this.#keys.delete(this.get(key)!)
		return super.delete(key)
	}

	override clear() {
		super.clear()
		this.#keys.clear()
	}
}

