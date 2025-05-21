
export class IdCounter {
	constructor(public count = 0) {}

	next() {
		return this.count++
	}
}

