
/** extended js map with handy methods like `require` and `guarantee` */
export class GMap<K, V> extends Map<K, V> {
	static need<K, V>(map: Map<K, V>, key: K) {
		if (map.has(key))
			return map.get(key) as V
		else
			throw new Error(`needed key not found: "${key}"`)
	}

	static guarantee<K, V>(map: Map<K, V>, key: K, make: () => V) {
		if (map.has(key))
			return map.get(key)!
		else {
			const value = make()
			map.set(key, value)
			return value
		}
	}

	static setEntries<K, V>(map: Map<K, V>, entries: Iterable<[K, V]>) {
		for (const [key, value] of entries)
			map.set(key, value)
		return map
	}

	array() {
		return [...this]
	}

	need(key: K) {
		return GMap.need(this, key)
	}

	guarantee(key: K, make: () => V) {
		return GMap.guarantee(this, key, make)
	}

	setEntries(entries: Iterable<[K, V]>) {
		GMap.setEntries(this, entries)
		return this
	}

	absorbObject(obj: object) {
		return this.setEntries(Object.entries(obj) as any[])
	}

	/** @deprecated renamed to `need` */
	require = this.need

	/** @deprecated renamed to `need` */
	static require = this.need
}

/** @deprecated renamed to `GMap` */
export const MapG = GMap

