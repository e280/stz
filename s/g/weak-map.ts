
/** extended weak map with handy methods like `require` and `guarantee` */
export class GWeakMap<K extends WeakKey, V> extends WeakMap<K, V> {
	static need<K extends WeakKey, V>(map: WeakMap<K, V>, key: K) {
		if (map.has(key))
			return map.get(key) as V
		else
			throw new Error(`needed key not found`)
	}

	static guarantee<K extends WeakKey, V>(map: WeakMap<K, V>, key: K, make: () => V) {
		if (map.has(key))
			return map.get(key)!
		else {
			const value = make()
			map.set(key, value)
			return value
		}
	}

	need(key: K) {
		return GWeakMap.need(this, key)
	}

	guarantee(key: K, make: () => V) {
		return GWeakMap.guarantee(this, key, make)
	}

	/** @deprecated renamed to `need` */
	require(key: K) {
		return GWeakMap.require(this, key)
	}

	/** @deprecated renamed to `need` */
	static require<K extends WeakKey, V>(map: WeakMap<K, V>, key: K) {
		if (map.has(key))
			return map.get(key) as V
		else
			throw new Error(`required key not found`)
	}
}

/** @deprecated renamed to `GWeakMap` */
export const WeakMapG = GWeakMap

