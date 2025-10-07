
import {bytes} from "./bytes.js"

/** @deprecated use `base64` instead */
export const Base64 = Object.freeze({
	fromBytes(bytes: Uint8Array) {
		return (typeof btoa === "function")
			? btoa(String.fromCharCode(...bytes))
			: Buffer.from(bytes).toString("base64")
	},

	toBytes(string: string) {
		return (typeof atob === "function")
			? Uint8Array.from(atob(string), char => char.charCodeAt(0))
			: Uint8Array.from(Buffer.from(string, "base64"))
	},

	random(count = 32) {
		return this.fromBytes(bytes.random(count))
	},

	/** @deprecated rename to "fromBytes" */
	string(bytes: Uint8Array) {
		return Base64.fromBytes(bytes)
	},

	/** @deprecated rename to "toBytes" */
	bytes(string: string) {
		return Base64.toBytes(string)
	},
})

