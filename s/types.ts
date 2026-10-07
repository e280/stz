
export type Json =
	| null
	| boolean
	| number
	| string
	| Json[]
	| {[key: string]: Json}

export type First<A extends any[]> = (
	A extends [infer X, ...any[]]
		? X
		: never
)

export type DropFirst<A extends any[]> = (
	A extends [any, ...infer X]
		? X
		: never
)

export type DropFirstParam<Fn extends (...params: any[]) => any> = (
	(...params: DropFirst<Parameters<Fn>>) => ReturnType<Fn>
)

