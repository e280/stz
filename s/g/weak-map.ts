
/** extended weak map with handy methods like `require` and `guarantee` */
export class GWeakMap<K extends WeakKey, V> extends WeakMap<K, V> {
	static require<K extends WeakKey, V>(map: WeakMap<K, V>, key: K) {
		if (map.has(key))
			return map.get(key) as V
		else
			throw new Error(`required key not found`)
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

	require(key: K) {
		return GWeakMap.require(this, key)
	}

	guarantee(key: K, make: () => V) {
		return GWeakMap.guarantee(this, key, make)
	}
}

/** @deprecated renamed to `GWeakMap` */
export const WeakMapG = GWeakMap

