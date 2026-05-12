
export function got<X>(thing: X | undefined | null): X {
	if (thing === undefined || thing === null) throw new Error(`got failed`)
	return thing
}

