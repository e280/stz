
export class DeadlineError extends Error {
	name = this.constructor.name
	constructor(milliseconds: number) {
		super(`deadline exceeded (${milliseconds.toLocaleString()} ms)`)
	}
}

/** set a deadline for a fn to do something, will reject with a `DeadlineError` if it takes too long */
export function deadline<R>(milliseconds: number, fn: () => Promise<R>) {
	return new Promise<R>((resolve, reject) => {

		const id = setTimeout(
			() => reject(new DeadlineError(milliseconds)),
			milliseconds,
		)

		fn()
			.then(resolve)
			.catch(reject)
			.finally(() => clearTimeout(id))
	})
}

