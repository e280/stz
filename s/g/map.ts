
/** extended js map with handy methods like `require` and `guarantee` */
export class GMap<K, V> extends Map<K, V> {
	static require<K, V>(map: Map<K, V>, key: K) {
		if (map.has(key))
			return map.get(key) as V
		else
			throw new Error(`required key not found: "${key}"`)
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

	array() {
		return [...this]
	}

	require(key: K) {
		return GMap.require(this, key)
	}

	guarantee(key: K, make: () => V) {
		return GMap.guarantee(this, key, make)
	}
}

/** @deprecated renamed to `GMap` */
export const MapG = GMap

