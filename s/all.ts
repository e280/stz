
/** it's just minimal-syntax sugar for Promise.all */
export async function all<Promises extends Promise<any>[]>(...promises: Promises) {
	return await Promise.all(promises)
}

