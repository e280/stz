
type MapLike<K, V> = {
	has(key: K): boolean
	get(key: K): V | undefined
	set(key: K, value: V): unknown
}

export function need<K, V>(map: Pick<MapLike<K, V>, "has" | "get">, key: K) {
	if (map.has(key))
		return map.get(key) as V
	else
		throw new Error("needed key not found")
}

export function guarantee<K, V>(map: MapLike<K, V>, key: K, make: () => V) {
	if (map.has(key))
		return map.get(key)!
	else {
		const value = make()
		map.set(key, value)
		return value
	}
}

export function inserts<K, V, M extends Pick<MapLike<K, V>, "set">>(map: M, entries: Iterable<[K, V]>) {
	for (const [key, value] of entries)
		map.set(key, value)
	return map
}

