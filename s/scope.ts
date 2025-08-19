
export type Scoped<Item> = [item: Item, dispose: () => void]
export type Disposable = {dispose(): void}

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

	/** register and return disposable item */
	registerDisposable<Item extends Disposable>(item: Item) {
		this.#disposers.push(() => item.dispose)
		return item
	}

	/** augment a fn to register its returned scoped item */
	fn<Params extends any[], Item>(fn: (...params: Params) => Scoped<Item>) {
		return (...a: Params) => {
			const scoped = fn(...a)
			return this.register(scoped)
		}
	}

	/** augment an async fn to register its returned scoped item */
	fnAsync<Params extends any[], Item>(fn: (...params: Params) => Promise<Scoped<Item>>) {
		return async(...a: Params) => {
			const scoped = await fn(...a)
			return this.register(scoped)
		}
	}

	/** augment a fn to register its returned disposable item */
	fnDisposable<Params extends any[], Item extends Disposable>(fn: (...params: Params) => Item) {
		return (...a: Params) => {
			const scoped = fn(...a)
			return this.registerDisposable(scoped)
		}
	}

	/** augment an async fn to register its returned disposable item */
	fnAsyncDisposable<Params extends any[], Item extends Disposable>(fn: (...params: Params) => Promise<Item>) {
		return async(...a: Params) => {
			const scoped = await fn(...a)
			return this.registerDisposable(scoped)
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

