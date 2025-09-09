
/** dispenses items, and auto-refills whenever empty */
export class Dispenser<T> {
	#content: T[] = []

	constructor(private getRefill: () => T[]) {
		this.#content = [...getRefill()]
	}

	/** see what's currently available in the dispenser */
	get currentStock() {
		return [...this.#content]
	}

	#refillWhenEmpty() {
		if (this.#content.length === 0)
			this.#content = [...this.getRefill()]
	}

	/** take everything that's left, and refill */
	takeAll() {
		const current = this.#content
		this.#content = [...this.getRefill()]
		return current
	}

	/** take a random item out of the dispenser */
	takeRandom() {
		this.#refillWhenEmpty()
		const index = Math.floor(Math.random() * this.#content.length)
		const [item] = this.#content.splice(index, 1)
		return item
	}

	/** take out the first item */
	takeFirst() {
		this.#refillWhenEmpty()
		return this.#content.shift()
	}

	/** take out the last item */
	takeLast() {
		this.#refillWhenEmpty()
		return this.#content.pop()
	}

	/** @alias takeFirst */
	shift = this.takeFirst.bind(this)

	/** @alias takeLast */
	pop = this.takeLast.bind(this)
}

