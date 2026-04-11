
import {ok} from "./ok.js"
import {err} from "./err.js"
import {Result} from "../types/result.js"

export function attempt<Value, E = unknown>(fn: () => Value): Result<Value, E> {
	try {
		return ok(fn())
	}
	catch (error) {
		return err(error as E)
	}
}

export async function attemptAsync<Value, E = unknown>(
		input: Promise<Value> | (() => Promise<Value>),
	): Promise<Result<Value, E>> {

	try {
		const promise = (typeof input === "function")
			? input()
			: input
		return ok(await promise)
	}
	catch (error) {
		return err(error as E)
	}
}

export function resultify<Params extends any[], Ret>(fn: (...params: Params) => Ret) {
	return (...params: Params) => attempt(() => fn(...params))
}

export function resultifyAsync<Params extends any[], Ret>(
		fn: (...params: Params) => Promise<Ret>
	) {
	return async(...params: Params) => attemptAsync(() => fn(...params))
}

