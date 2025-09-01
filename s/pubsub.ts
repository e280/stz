
import {defer} from "./defer.js"

export type Listener<A extends any[]> = (...a: A) => (void | Promise<void>)

export interface Xub<A extends any[] = []> {

	/** publish to all subscribed listeners. */
	publish(...a: A): Promise<void>

	/** subscribe a listener function. */
	subscribe(fn: Listener<A>): () => void

	/** publish to all subscribed listeners, with pubsub facilities. */
	pub: Pub<A>

	/** subscribe a listener function, with pubsub facilities. */
	sub: Sub<A>

	/**
	 * subscribe a listener function.
	 * @alias subscribe
	 */
	on(fn: Listener<A>): () => void

	/** wait for the next published value */
	next(): Promise<A>

	/** wipe all listeners attached to this. */
	clear(): void
}

/** subscriber fn that can be published to. */
export interface Sub<A extends any[] = []> extends Xub<A> {
	(fn: Listener<A>): () => void
}

/** publisher fn that can be published to. */
export interface Pub<A extends any[] = []> extends Xub<A> {
	(...a: A): Promise<void>
}

/** make pubsub facilities */
export function xub<A extends any[] = []>() {
	const set = new Set<Listener<A>>()

	async function publish(...a: A) {
		await Promise.all([...set].map(fn => fn(...a)))
	}

	function subscribe(fn: Listener<A>) {
		set.add(fn)
		return () => { set.delete(fn) }
	}

	async function pub(...a: A) {
		return publish(...a)
	}

	function sub(fn: Listener<A>) {
		return subscribe(fn)
	}

	async function next(fn?: Listener<A>) {
		const {promise, resolve} = defer<A>()
		const unsubscribe = sub(async(...a) => {
			if (fn) await fn(...a)
			resolve(a)
			unsubscribe()
		})
		return promise
	}

	function clear() {
		set.clear()
	}

	const x = {
		pub,
		sub,
		publish,
		subscribe,
		on: subscribe,
		next,
		clear,
	} as Xub<A>

	Object.assign(sub, x)
	Object.assign(pub, x)
	return x
}

/** create a subscriber fn that also has pubsub facilities */
export function sub<A extends any[] = []>(listener?: Listener<A>): Sub<A> {
	const x = xub<A>()
	if (listener) x.sub(listener)
	return x.sub
}

/** create a publisher fn that also has pubsub facilities */
export function pub<A extends any[] = []>(listener?: Listener<A>): Pub<A> {
	const x = xub<A>()
	if (listener) x.sub(listener)
	return x.pub
}

