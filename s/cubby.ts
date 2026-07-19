
export type Cubby<X = unknown> = {
	get(): Promise<X | undefined>
	set(data: X | undefined): Promise<void>
}

