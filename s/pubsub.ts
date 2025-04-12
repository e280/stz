
import {deferPromise} from "./defer-promise.js"

export type Listener<A extends any[]> = (...a: A) => (void | Promise<void>)

export interface Sub<A extends any[] = []> {
	(fn: Listener<A>): () => void
	pub(...a: A): Promise<void>
	once(): Promise<A>
	clear(): void
}

export interface Pub<A extends any[] = []> {
	(...a: A): Promise<void>
	sub(fn: Listener<A>): () => void
	once(): Promise<A>
	clear(): void
}

function setup<A extends any[] = []>() {
	const set = new Set<Listener<A>>()

	function sub(fn: Listener<A>) {
		set.add(fn)
		return () => { set.delete(fn) }
	}

	async function pub(...a: A) {
		await Promise.all([...set].map(fn => fn(...a)))
	}

	function clear() {
		set.clear()
	}

	async function once() {
		const {promise, resolve} = deferPromise<A>()
		const unsubscribe = sub((...a) => {
			resolve(a)
			unsubscribe()
		})
		return promise
	}

	sub.pub = pub
	sub.clear = clear
	sub.once = once

	pub.sub = sub
	pub.clear = clear
	pub.once = once

	return [pub, sub] as [Pub<A>, Sub<A>]
}

/** create a subscriber fn that can be published to */
export function sub<A extends any[] = []>(): Sub<A> {
	return setup<A>()[1]
}

/** create a publisher fn that can be subscribed to */
export function pub<A extends any[] = []>(): Pub<A> {
	return setup<A>()[0]
}

