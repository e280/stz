
import {defer, Deferred} from "./defer.js"

export type On<P extends any[]> = (fn: Fn<P>) => () => void
export type Publish<P extends any[]> = Fn<P>

export type Subby<P extends any[]> = On<P> & ReturnType<typeof mk<P>>
export type Pubby<P extends any[]> = Publish<P> & ReturnType<typeof mk<P>>

export function subby<P extends any[]>(fn?: Fn<P>) {
	const tools = mk()
	const subby = (fn: Fn<P>) => tools.on(fn)
	Object.assign(subby, tools)
	if (fn) tools.on(fn)
	return subby as Subby<P>
}

export function pubby<P extends any[]>(fn?: Fn<P>) {
	const tools = mk()
	const pubby = (...p: P) => tools.publish(...p)
	Object.assign(pubby, tools)
	if (fn) tools.on(fn)
	return pubby as Pubby<P>
}

////////////////////////////////////////////////////////////////

type Fn<P extends any[]> = (...p: P) => void

function mk<P extends any[]>() {
	const set = new Set<Fn<P>>()

	let waiter: Deferred<P> | undefined
	const next = () => waiter ??= defer()

	const on = (fn: Fn<P>) => {
		set.add(fn)
		return () => { set.delete(fn) }
	}

	const publish = (...p: P) => {
		waiter?.resolve(p)
		waiter = undefined

		for (const fn of set)
			fn(...p)
	}

	return {set, on, publish, next}
}

