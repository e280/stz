
import {Hex} from "../hex.js"
import {Base58} from "../base58.js"
import {Bytename} from "./bytename.js"

export type BadgeOptions = {
	leadBytes: number
	leadSeparator: string
	restSeparator: string
}

export type ParsedBadge = {
	lead: string
	rest: string
	bytes: Uint8Array
}

/**
 * Badge is a human-friendly presentation format for arbitrary binary data.
 *  - looks like "nodlyn.fasrep:39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"
 *  - the first lead bytes are shown in bytename format
 *  - the rest of the data is in base58
 *  - designed to be a nice way to present 256-bit passport thumbprints
 *  - can actually represent any number of bytes
 *  - "nodlyn.fasrep:39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"
 */
export const Badge = {
	defaults: (<BadgeOptions>{
		leadBytes: 4,
		leadSeparator: ".",
		restSeparator: ":",
	}),

	string(bytes: Uint8Array, options: Partial<BadgeOptions> = {}) {
		const {leadBytes, leadSeparator, restSeparator}
			= {...Badge.defaults, ...options}

		const appetizer = Bytename.string(bytes.slice(0, leadBytes), {
			wordSeparator: leadSeparator,
			groupSeparator: leadSeparator,
		})

		return (bytes.length > leadBytes)
			? `${appetizer}${restSeparator}${Base58.string(bytes.slice(leadBytes))}`
			: appetizer
	},

	parse(badge: string): ParsedBadge {
		badge = badge.trim()
		const parts = badge.split(/[^a-zA-Z0-9]+/m)
			.filter(Boolean)
			.map(s => s.trim())

		if (parts.length < 2) {
			const lead = parts.join(".")
			const bytes = Bytename.bytes(lead)
			return {lead, rest: "", bytes}
		}

		const rest = parts.pop()!
		const lead = parts.join(".")
		const bytes = new Uint8Array([
			...Bytename.bytes(lead),
			...Base58.bytes(rest),
		])
		return {lead, rest, bytes}
	},

	bytes(badge: string) {
		return Badge.parse(badge).bytes
	},

	hex(badge: string) {
		return Hex.string(Badge.bytes(badge))
	},

	fromHex(hex: string, options?: Partial<BadgeOptions>) {
		return Badge.string(Hex.bytes(hex), options)
	},
}

