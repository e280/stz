
import {ok} from "./ok.js"
import {err} from "./err.js"
import {Result} from "../types/result.js"

export async function attempt<Value, E = string>(fn: () => Promise<Value>): Promise<Result<Value, E>> {
	return attemptPromise<Value, E>(fn())
}

export async function attemptPromise<Value, E = string>(promise: Promise<Value>): Promise<Result<Value, E>> {
	return promise
		.then(value => ok(value))
		.catch(error => err<E>(error))
}

