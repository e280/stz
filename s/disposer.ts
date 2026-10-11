
export type Disposer = {
	(): void
	schedule: (...fns: (() => void)[]) => Disposer
	own: <X>(x: X, fn: (x: X) => void) => X
	disposables: <X extends Disposable>(x: X) => X
}

export type Disposable = {
	dispose: () => void
}

export function disposer(): Disposer {
	let fns: (() => void)[] = []

	const dispose = () => {
		const doomed = fns
		fns = []
		for (let i = doomed.length - 1; i >= 0; i--)
			doomed[i]()
	}

	function d() {
		dispose()
	}

	d.dispose = dispose

	d.schedule = (...newFns: (() => void)[]) => {
		fns.push(...newFns)
		return d
	}

	d.own = <X>(x: X, fn: (x: X) => void) => {
		fns.push(() => fn(x))
		return x
	}

	d.disposables = <X extends Disposable>(x: X) => {
		fns.push(() => x.dispose())
		return x
	}

	return d
}

