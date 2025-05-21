
/** a promise which can be resolved from the outside */
export type Deferred<R> = {
	promise: Promise<R>
	resolve: (result: R) => void
	reject: (reason: any) => void

	/** ties the fate of this deferred promise to the outcome of the provided outsidePromise */
	entangle: (outsidePromise: Promise<R>) => Promise<R>
}

/** returns a deferred promise with exposed resolve and reject fns */
export function defer<R>(): Deferred<R> {
	let resolve!: (result: R) => void
	let reject!: (reason: any) => void

	const promise = new Promise<R>((res, rej) => {
		resolve = res
		reject = rej
	})

	function entangle(outside: Promise<R>) {
		outside.then(resolve).catch(reject)
		return promise
	}

	return {promise, resolve, reject, entangle}
}

