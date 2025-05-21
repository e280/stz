
/** create a promise that waits for a number of milliseconds. */
export const nap = (milliseconds: number = 0) => (
	new Promise<void>(resolve => setTimeout(resolve, milliseconds))
)

