
export type Piper<I, O> = (input: I) => O

export function pipe<I>(input: I) {
	return new Pipe(input)
}

export class Pipe<I> {
	#input: I

	constructor(input: I) {
		this.#input = input
	}

	to<O>(fn: Piper<I, O>) {
		return new Pipe(fn(this.#input))
	}

	done() {
		return this.#input
	}
}

