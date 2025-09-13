
export type Rest<T extends any[]> = (
	T extends [any, ...infer R]
		? R
		: never
)

export type First<T extends any[]> = (
	T extends [infer First, ...any[]]
		? First
		: never
)

export type RestParams<Fn extends (...params: any[]) => any> = (
	(...params: Rest<Parameters<Fn>>) => ReturnType<Fn>
)

