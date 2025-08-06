
export class DeadlineError extends Error {
	name = this.constructor.name
	constructor(public milliseconds: number) {
		super(`deadline exceeded (${(milliseconds / 1000).toFixed(1)} seconds)`)
	}
}

/** set a deadline for a fn to do something, will reject with a `DeadlineError` if it takes too long */
export function deadline<R>(milliseconds: number, fn: () => Promise<R>) {
	if (milliseconds <= 0 || milliseconds === Infinity)
		return fn()

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

