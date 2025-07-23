
export function repeatly(
		milliseconds: number,
		fn: () => Promise<void>,
		onError: (error: any) => void = () => {},
	) {

	let timeout: any
	let stop = false

	const halt = () => {
		stop = true
		clearTimeout(timeout)
	}

	const tick = async() => {
		if (stop) return undefined
		try {
			await fn()
			timeout = setTimeout(tick, milliseconds)
		}
		catch (error) {
			halt()
			onError(error)
		}
	}

	timeout = setTimeout(tick, milliseconds)
	return halt
}

