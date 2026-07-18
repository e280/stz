
/**
 * create a job queue that ensures the given fn is always called in sequence (not concurrently).
 */
export function queue<Args extends any[], Result>(
		fn: (...args: Args) => Promise<Result>,
		limit = Infinity,
	): (...args: Args) => Promise<Result> {

	let pending = 0
	let last: Promise<any> = Promise.resolve()

	return (...args: Args): Promise<Result> => {
		if (pending >= limit)
			return Promise.reject(new Error(`queue limit exceeded (${limit})`))

		pending++

		const job = async() => {
			try { return await fn(...args) }
			finally { pending-- }
		}

		const current = last.then(job)

		// prevent unhandled rejection breaking the chain
		last = current.catch(() => {})

		return current
	}
}

