
export function assert<Value>(
		value: Value,
		message = "assert fail",
	): asserts value  {

	if (!value)
		throw new Error(message)
}

