
/** a trashcan where you can collect disposer fns, and dispose them all at once */
export class Trash {
	#fns: (() => void)[] = []

	/** add a disposer fn to the trashcan */
	add(...fns: (() => void)[]) {
		this.#fns.push(...fns)
		return this
	}

	/** add a disposable object to the trashcan, and return the object */
	disposable<X extends {dispose: () => void}>(x: X) {
		return this.bag(x, () => x.dispose())
	}

	/** add an item's disposer fn, and return the item */
	bag<X>(x: X, fn: (x: X) => void) {
		this.add(() => fn(x))
		return x
	}

	/** dispose of everything in the trashcan */
	dispose() {
		for (const fn of this.#fns.reverse())
			fn()
		this.#fns = []
	}
}

