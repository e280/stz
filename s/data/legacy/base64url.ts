
import {bytes} from "../bytes.js"
import {Base64} from "./base64.js"

/** @deprecated use `base64url` instead */
export const Base64url = {
	fromBytes(bytes: Uint8Array) {
		return Base64.fromBytes(bytes)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/g, "")
	},

	toBytes(string: string) {
		let b64 = string
			.replace(/-/g, "+")
			.replace(/_/g, "/")
		if (b64.length % 4 !== 0)
			b64 = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, "=")
		return Base64.toBytes(b64)
	},

	random(count = 32) {
		return this.fromBytes(bytes.random(count))
	},

	/** @deprecated renamed to "fromBytes" */
	string(bytes: Uint8Array) {
		return Base64url.fromBytes(bytes)
	},

	/** @deprecated renamed to "toBytes" */
	bytes(string: string) {
		return Base64url.toBytes(string)
	},
}

