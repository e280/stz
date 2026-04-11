
import {ok} from "./ok.js"
import {err} from "./err.js"
import {Result} from "../types/result.js"

export function resultify<Params extends any[], Ret>(fn: (...params: Params) => Ret) {
	return (...params: Params) => {
		try {
			return ok(fn(...params))
		}
		catch (error) {
			return err(error)
		}
	}
}

export function resultifyAsync<Ret>(input: Promise<Ret>): Promise<Result<Ret>>;
export function resultifyAsync<Params extends any[], Ret>(input: (...params: Params) => Promise<Ret>): (...params: Params) => Promise<Result<Ret>>;
export function resultifyAsync<Params extends any[], Ret>(input: Promise<Ret> | ((...params: Params) => Promise<Ret>)): Promise<Result<Ret>> | ((...params: Params) => Promise<Result<Ret>>) {

	if (typeof input === "function") {
		return async(...params) => {
			try {
				return ok(await input(...params))
			}
			catch (error) {
				return err(error)
			}
		}
	}
	else {
		return input
			.then(value => ok(value))
			.catch(error => err(error))
	}
}

/** @deprecated replaced by `resultify` */
export function attempt<Value, E = unknown>(fn: () => Value): Result<Value, E> {
	try {
		return ok(fn())
	}
	catch (error) {
		return err(error as E)
	}
}

/** @deprecated replaced by `resultifyAsync` */
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

