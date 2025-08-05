
/**
 * create a job queue that ensures the given fn is always called in sequence (not concurrently).
 */
export function queue<Args extends any[], Result>(
		fn: (...args: Args) => Promise<Result>
	): (...args: Args) => Promise<Result> {

	let last: Promise<any> = Promise.resolve()

	return (...args: Args): Promise<Result> => {
		const job = () => fn(...args)
		const current = last.then(job)

		// prevent unhandled rejection breaking the chain
		last = current.catch(() => {})

		return current
	}
}

