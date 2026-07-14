
export function got<X>(thing: X | undefined | null, err = "got failed"): X {
	if (thing === undefined || thing === null) throw new Error(err)
	return thing
}

