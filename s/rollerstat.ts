
export class Rollerstat {
	#memoryLimit = 10
	#array: number[] = []

	constructor(memoryLimit = this.#memoryLimit) {
		this.memoryLimit = memoryLimit
	}

	get memoryLimit() {
		return this.#memoryLimit
	}

	set memoryLimit(x: number) {
		if (!Number.isSafeInteger(x) || x < 0)
			throw new Error("invalid memory limit")
		this.#memoryLimit = x
		this.#trim()
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

	get length() {
		return this.#array.length
	}

	add(x: number) {
		this.#array.push(x)
		this.#trim()
		return this
	}

	clear() {
		this.#array = []
		return this
	}

	#trim() {
		while (this.#array.length > this.#memoryLimit)
			this.#array.shift()
	}
}

