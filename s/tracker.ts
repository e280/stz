
import {Sub, sub} from "./pubsub.js"

/**
 * tracking system for state management.
 *  - it tracks when items are seen or changed
 *
 * for item integration,
 *  - items can call `tracker.see(this)` when they are accessed
 *  - items can call `tracker.change(this)` when they are reassigned
 *
 * for reactivity integration,
 *  - run `tracker.seen(renderFn)`, collecting a set of seen items
 *  - loop over each seen item, attach a changed handler `tracker.changed(item, handlerFn)`
 */
export class Tracker<Item extends object = any> {
	#seeables: Set<Item>[] = []
	#changeables = new WeakMap<Item, Sub>()

	/** indicate item was accessed */
	see(item: Item) {
		this.#seeables.at(-1)?.add(item)
	}

	/** collect which items were seen during fn */
	seen(fn: () => void): Set<Item> {
		this.#seeables.push(new Set())
		fn()
		return this.#seeables.pop()!
	}

	/** indicate item was changed */
	change(item: Item) {
		this.#guaranteeChangeable(item).pub()
	}

	/** respond to changes by calling fn */
	changed(item: Item, fn: () => void) {
		return this.#guaranteeChangeable(item)(fn)
	}

	#guaranteeChangeable(item: Item) {
		let on = this.#changeables.get(item)
		if (!on) {
			on = sub()
			this.#changeables.set(item, on)
		}
		return on
	}
}

const key = Symbol.for("e280.tracker")

/** standard global tracker for integrations */
export const tracker = (globalThis as any)[key] ??= new Tracker()

