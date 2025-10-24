
import {defer, Deferred} from "../defer.js"

export function debounceMicrotask<F extends (...params: any[]) => any>(fn: F) {
	let scheduled: {
		params: any[]
		deferred: Deferred<any>
	} | null = null

	return ((...params: any[]) => {
		if (scheduled) {
			scheduled.params = params
		}
		else {
			scheduled = {params, deferred: defer()}
			queueMicrotask(() => {
				const {params, deferred} = scheduled!
				scheduled = null
				Promise.resolve(fn(...params))
					.then(deferred.resolve)
					.catch(deferred.reject)
			})
		}
		return scheduled.deferred.promise
	}) as ((...params: Parameters<F>) => Promise<ReturnType<F>>)
}

