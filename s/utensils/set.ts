
type SetLike<V> = {
	has(value: V): boolean
	add(value: V): void
	delete(value: V): void
}

export function adds<V, S extends SetLike<V>>(set: S, values: Iterable<V>) {
	for (const value of values)
		set.add(value)
	return set
}

export function deletes<V, S extends SetLike<V>>(set: S, values: Iterable<V>) {
	for (const value of values)
		set.delete(value)
	return set
}

