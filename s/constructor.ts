
export type Constructor<T extends {} = {}> = new(...args: any[]) => T

export type Ctor<
	Params extends any[] = any[],
	Instance extends {} = {},
> = new(...params: Params) => Instance

export function denew<
		Params extends any[] = any[],
		Instance extends {} = {},
	>(C: Ctor<Params, Instance>) {
	return (...p: Params) => new C(...p)
}

