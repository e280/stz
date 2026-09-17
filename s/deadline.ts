
import {is} from "./is.js"

export class DeadlineError extends Error {
	name = this.constructor.name
	constructor(public milliseconds: number) {
		super(`deadline exceeded (${(milliseconds / 1000).toFixed(1)} seconds)`)
	}
}

async function invoke<R>(fn: Promise<R> | (() => Promise<R>)) {
	return is.fn(fn)
		? fn()
		: fn
}

/** set a deadline for a fn to do something, will reject with a `DeadlineError` if it takes too long */
export function deadline<R>(milliseconds: number | undefined | null, fn: Promise<R> | (() => Promise<R>)) {
	if (milliseconds === undefined || milliseconds === null || milliseconds === Infinity)
		return invoke(fn)

	if (milliseconds < 0 || Number.isNaN(milliseconds))
		throw new RangeError("invalid value provided as milliseconds to deadline fn")

	if (milliseconds === 0)
		return Promise.reject(new DeadlineError(milliseconds))

	return new Promise<R>((resolve, reject) => {
		const id = setTimeout(
			() => reject(new DeadlineError(milliseconds)),
			milliseconds,
		)
		invoke(fn)
			.then(resolve)
			.catch(reject)
			.finally(() => clearTimeout(id))
	})
}

