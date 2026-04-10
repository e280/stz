
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

export async function attemptAsync<Value, E = unknown>(fn: () => Promise<Value>): Promise<Result<Value, E>> {
	return attemptPromise<Value, E>(fn())
}

export async function attemptPromise<Value, E = unknown>(promise: Promise<Value>): Promise<Result<Value, E>> {
	return promise
		.then(value => ok(value))
		.catch(error => err<E>(error))
}

