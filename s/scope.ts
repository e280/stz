
export type Scoped<Item> = [item: Item, dispose: () => void]

export function scoped<Item>(item: Item, dispose: () => void) {
	return [item, dispose] as Scoped<Item>
}

export class Scope {
	#disposers: (() => void)[] = []

	/** add a dispose fn */
	add(dispose: () => void) {
		this.#disposers.push(dispose)
	}

	/** add a dispose fn, and return the item */
	reg<Item>(item: Item, dispose: () => void) {
		this.add(dispose)
		return item
	}

	/** add a scoped item's disposer, and return the item */
	register<Item>([item, dispose]: Scoped<Item>) {
		this.add(dispose)
		return item
	}

	/** augment a fn to register its returned scoped item */
	fn<Params extends any[], X>(fn: (...params: Params) => Scoped<X>) {
		return (...a: Params) => {
			const scoped = fn(...a)
			this.register(scoped)
			return scoped[0]
		}
	}

	/** augment an async fn to register its returned scoped item */
	asyncFn<Params extends any[], X>(fn: (...params: Params) => Promise<Scoped<X>>) {
		return async(...a: Params) => {
			const scoped = await fn(...a)
			this.register(scoped)
			return scoped[0]
		}
	}

	/** create a subscope that is registered, so disposing the parent will dispose the children */
	sub() {
		const scope = new Scope()
		return this.reg(scope, () => scope.dispose())
	}

	/** dispose all the disposers added to this scope */
	dispose() {
		for (const fn of this.#disposers.reverse())
			fn()
		this.#disposers = []
	}
}

