
import {deferPromise} from "./defer-promise.js"

export type Listener<A extends any[]> = (...a: A) => (void | Promise<void>)

export interface Xub<A extends any[] = []> {
	pub(...a: A): Promise<void>
	sub(fn: Listener<A>): () => void
	once(): Promise<A>
	clear(): void
}

export interface Sub<A extends any[] = []> extends Xub<A> {
	(fn: Listener<A>): () => void
}

export interface Pub<A extends any[] = []> extends Xub<A> {
	(...a: A): Promise<void>
}

export function xub<A extends any[] = []>() {
	const set = new Set<Listener<A>>()

	function sub(fn: Listener<A>) {
		set.add(fn)
		return () => { set.delete(fn) }
	}

	async function pub(...a: A) {
		await Promise.all([...set].map(fn => fn(...a)))
	}

	async function once() {
		const {promise, resolve} = deferPromise<A>()
		const unsubscribe = sub((...a) => {
			resolve(a)
			unsubscribe()
		})
		return promise
	}

	function clear() {
		set.clear()
	}

	sub.pub = pub
	sub.sub = sub
	sub.once = once
	sub.clear = clear

	pub.pub = pub
	pub.sub = sub
	pub.once = once
	pub.clear = clear

	return [pub, sub] as [Pub<A>, Sub<A>]
}

/** create a subscriber fn that can be published to */
export function sub<A extends any[] = []>(): Sub<A> {
	return xub<A>()[1]
}

/** create a publisher fn that can be subscribed to */
export function pub<A extends any[] = []>(): Pub<A> {
	return xub<A>()[0]
}

