
import {Random} from "./types.js"
import {u32ify} from "./u32ify.js"

/** facility for doing common random things, like picking a random item from an array. */
export class Rand {
	constructor(public random: Random = Math.random) {}

	/** random positive unsigned 32-bit integer. */
	u32() {
		return u32ify(this.random())
	}

	/** randomly returns true given a probability fraction. */
	roll(chance = 0.5) {
		return this.random() < chance
	}

	/** random number between two numbers. */
	range(min: number, max: number) {
		return min + (this.random() * (max - min))
	}

	/** random integer from min to max (inclusive). */
	integerRange(min: number, max: number) {
		return min + Math.floor(this.random() * (max - min + 1))
	}

	/** random array index given an array length. */
	index(length: number) {
		return Math.floor(this.random() * length)
	}

	/** randomly choose one item from the provided array. */
	pick<T>(array: T[]) {
		return array[this.index(array.length)]
	}

	/** randomly select a given number of array items. */
	select<T>(count: number, array: T[]) {
		const copy = [...array]
		if (count >= array.length)
			return copy

		const selection: T[] = []
		for (let i = 0; i < count; i++)
			selection.push(this.yoink(copy))
		return selection
	}

	/** remove a random item from the array, and return it. */
	yoink<T>(array: T[]) {
		const index = this.index(array.length)
		const [item] = array.splice(index, 1)
		return item
	}

	/** randomly remove the given number of items from the array. */
	extract<T>(count: number, array: T[]) {
		const selection: T[] = []
		for (let i = 0; i < count; i++) {
			if (array.length === 0)
				return selection
			selection.push(this.yoink(array))
		}
		return selection
	}

	/** randomly shuffle an array in-place using fisher-yates. */
	shuffle<T>(array: T[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(this.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}
}

