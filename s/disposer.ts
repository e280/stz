
export type Disposer = {
	(): void
	schedule: (...fns: (() => void)[]) => Disposer
	own: <X>(x: X, fn: (x: X) => void) => X
}

export function disposer(): Disposer {
	let fns: (() => void)[] = []

	function d() {
		for (const fn of fns.reverse()) fn()
		fns = []
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

