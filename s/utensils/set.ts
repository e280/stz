
export function adds<V, S extends {add(value: V): void}>(set: S, values: Iterable<V>) {
	for (const value of values)
		set.add(value)
	return set
}

export function deletes<V, S extends {delete(value: V): void}>(set: S, values: Iterable<V>) {
	for (const value of values)
		set.delete(value)
	return set
}

