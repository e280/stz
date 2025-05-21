
/** return a single function that calls all the provided functions */
export function coalesce<A extends any[] = []>(...fns: ((...a: A) => void)[]) {
	return (...a: A) => fns.forEach(fn => fn(...a))
}

