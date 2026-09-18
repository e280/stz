
export type Disposer = {
	(): void
	schedule: (...fns: (() => void)[]) => Disposer
	own: <X>(x: X, fn: (x: X) => void) => X
}

export function disposer(): Disposer {
	let fns: (() => void)[] = []

	function d() {
		const doomed = fns
		fns = []
		for (let i = doomed.length - 1; i >= 0; i--)
			doomed[i]()
	}

	d.schedule = (...newFns: (() => void)[]) => {
		fns.push(...newFns)
		return d
	}

	d.own = <X>(x: X, fn: (x: X) => void) => {
		fns.push(() => fn(x))
		return x
	}

	return d
}

