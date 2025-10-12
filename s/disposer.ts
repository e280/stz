
export type Disposer = {
	(): void
	schedule: (...fns: (() => void)[]) => Disposer
}

export function disposer(): Disposer {
	let fns: (() => void)[] = []

	function d() {
		for (const fn of fns) fn()
		fns = []
	}

	d.schedule = (...newFns: (() => void)[]) => {
		fns.push(...newFns)
		return d
	}

	return d
}

