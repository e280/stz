
export function array(length: number): number[]
export function array<X>(length: number, fn: (i: number) => X): X[]
export function array<X>(
		length: number,
		fn?: (i: number) => X,
	) {

	const result: (X | number)[] = []

	for (let i = 0; i < length; i++)
		result.push(fn ? fn(i) : i)

	return result
}

