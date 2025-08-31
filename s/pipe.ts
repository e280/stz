
export type Piper<I, O> = (input: I) => O

export function pipe<I>(input: I) {
	return new Pipe(input)
}

export class Pipe<I> {
	#input: I
	static with = pipe

	constructor(input: I) {
		this.#input = input
	}

	to<O>(fn: Piper<I, O>) {
		return new Pipe(fn(this.#input))
	}

	done() {
		return this.#input
	}

	line(...fns: Piper<I, I>[]) {
		let x = this.#input
		for (const fn of fns) x = fn(x)
		return x
	}
}

