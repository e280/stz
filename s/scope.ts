
import {Constructor} from "./constructor.js"

export type Scoped<Item> = [item: Item, dispose: () => void]
export type Disposable = {dispose(): void}

export function scoped<Item>(item: Item, dispose: () => void) {
	return [item, dispose] as Scoped<Item>
}

/**
 * a trashcan you can fill with garbage, then call `scope.dispose()` to dump it all
 *  - `add/stow/scoped` methods are for dealing with disposer fns
 *  - `keep` methods are for dealing with disposable objects (with a dispose method)
 *  - `sub` for creating nested sub-scopes
 */
export class Scope implements Disposable {
	#disposers: (() => void)[] = []

	/** add disposer fn */
	add(dispose: () => void) {
		this.#disposers.push(dispose)
		return this
	}

	/** add disposer, return item */
	stow<Item>(item: Item, dispose: () => void) {
		this.add(dispose)
		return item
	}

	/** add scoped disposer, return item */
	scoped<Item>([item, dispose]: Scoped<Item>) {
		this.add(dispose)
		return item
	}

	/** add and return a disposable object */
	keep<D extends Disposable>(disposable: D) {
		this.add(() => disposable.dispose())
		return disposable
	}

	/** wrap a fn, auto-add returned disposers */
	scopedFn<Params extends any[], Item>(
			fn: (...params: Params) => Scoped<Item>
		) {
		return (...a: Params) => {
			const scoped = fn(...a)
			return this.scoped(scoped)
		}
	}

	/** wrap an async fn, auto-add returned disposers */
	scopedFnAsync<Params extends any[], Item>(
			fn: (...params: Params) => Promise<Scoped<Item>>
		) {
		return async(...a: Params) => {
			const scoped = await fn(...a)
			return this.scoped(scoped)
		}
	}

	/** wrap a fn, auto-add returned disposables */
	keepFn<Params extends any[], D extends Disposable>(
			fn: (...params: Params) => D
		) {
		return (...a: Params) => {
			const disposable = fn(...a)
			return this.keep(disposable)
		}
	}

	/** wrap an async fn, auto-add returned disposables */
	keepFnAsync<Params extends any[], D extends Disposable>(
			fn: (...params: Params) => Promise<D>
		) {
		return async(...a: Params) => {
			const disposable = await fn(...a)
			return this.keep(disposable)
		}
	}

	/** wrap a constructor, auto-add returned disposables */
	keepConstructor<C extends Constructor<Disposable>>(Ctor: C) {
		const scope = this
		return class extends Ctor {
			constructor(...p: any[]) {
				super(...p)
				scope.keep(this)
			}
		} as C
	}

	/** create a subscope, child gets disposed when parent does */
	sub() {
		const subscope = new Scope()
		return this.stow(subscope, () => subscope.dispose())
	}

	/** dispose everything in this scope, in reverse order */
	dispose() {
		for (const fn of this.#disposers.reverse())
			fn()
		this.#disposers = []
	}
}

