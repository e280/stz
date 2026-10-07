
export function disposables(...things: {dispose: () => void}[]) {
	return () => {
		for (const thing of things)
			thing.dispose()
	}
}

