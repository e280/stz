
/**
 * repeat the given async function over and over.
 *  - consider using `nap` in your fn to create a delay
 */
export function cycle(fn: (stop: () => void) => Promise<void>) {
	let timeout: any
	let stopped = false

	const stop = () => {
		stopped = true
		clearTimeout(timeout)
	}

	const tick = async() => {
		if (stopped) return
		await fn(stop)
		if (stopped) return
		timeout = setTimeout(tick, 0)
	}

	tick()
	return stop
}

/** @deprecated renamed to `cycle` */
export const repeat = cycle

