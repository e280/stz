
export class Rollerstat {
	#array: number[] = []

	constructor(public memoryLimit = 10) {
		if (memoryLimit < 0 || !Number.isSafeInteger(memoryLimit))
			throw new Error("invalid memory limit")
	}

	get average() {
		if (this.#array.length === 0)
			return undefined

		let sum = 0
		for (const x of this.#array)
			sum += x

		return sum / this.#array.length
	}

	get latest() {
		return this.#array.at(-1)
	}

	get all() {
		return [...this.#array]
	}

	get min() {
		return this.#array.length
			? Math.min(...this.#array)
			: undefined
	}

	get max() {
		return this.#array.length
			? Math.max(...this.#array)
			: undefined
	}

	add(x: number) {
		this.#array.push(x)
		while (this.#array.length > this.memoryLimit)
			this.#array.shift()
		return this
	}

	clear() {
		this.#array = []
		return this
	}
}

