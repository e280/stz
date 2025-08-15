
/** extended js map with handy methods like `require` and `guarantee` */
export class MapG<K, V> extends Map<K, V> {
	static require<K, V>(map: Map<K, V>, key: K) {
		if (map.has(key))
			return map.get(key)!
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
		return MapG.require(this, key)
	}

	guarantee(key: K, make: () => V) {
		return MapG.guarantee(this, key, make)
	}
}

export type Identifiable<Id = any> = {id: Id}

/** js map but for things that have an `id` field */
export class PoolG<V extends Identifiable> extends MapG<V["id"], V> {
	got(value: V) {
		return this.has(value.id)
	}

	add(value: V) {
		this.set(value.id, value)
		return value
	}

	remove(value: V) {
		return this.delete(value.id)
	}
}

