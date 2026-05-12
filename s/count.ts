
export function* count(n: number) {
	for (let i = 0; i < n; i++)
		yield i
}

export function* count2d([columns, rows]: [number, number]) {
	for (let y = 0; y < rows; y++)
		for (let x = 0; x < columns; x++)
			yield [x, y] as [number, number]
}

export function range(n: number) {
	return [...count(n)]
}

