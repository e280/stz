
export class SetG<T> extends Set<T> {
	array() {
		return [...this]
	}

	hasAll(...items: T[]) {
		return items.every(item => this.has(item))
	}

	adds(...items: T[]) {
		for (const item of items) this.add(item)
		return this
	}

	deletes(...items: T[]) {
		for (const item of items) this.delete(item)
		return this
	}
}

