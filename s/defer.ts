
/** a promise which can be resolved or rejected from the outside */
export type Deferred<R = void> = Promise<R> & {
	resolve: (result: R | PromiseLike<R>) => void
	reject: (reason: any) => void

	/** adopt the outcome of another promise */
	entangle: (other: Promise<R>) => Promise<R>

	/** @deprecated instead of `deferred.promise`, deferred is now itself a promise, just use `deferred` */
	promise: Promise<R>
}

/** returns a deferred promise with exposed resolve and reject fns */
export function defer<R = void>(): Deferred<R> {
	let resolve!: (result: R | PromiseLike<R>) => void
	let reject!: (reason: any) => void

	const promise = new Promise<R>((res, rej) => {
		resolve = res
		reject = rej
	}) as Deferred<R>

	promise.resolve = resolve
	promise.reject = reject
	promise.promise = promise

	promise.entangle = (other: Promise<R>) => {
		other.then(resolve, reject)
		return promise
	}

	return promise
}

