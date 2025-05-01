
import {Hex} from "../hex.js"
import {Badge} from "./badge.js"
import {Bytes} from "../bytes.js"
import {Science, test, expect} from "@e280/science"

const sampleBadge = "nodlyn.fasrep:39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"
const sampleHex = "88e8c3fad1028fcf6ce5ac491578850f4d833336feca03b608265501c3019d59"
const sampleBytes = Hex.bytes(sampleHex)

function good(bytes: Uint8Array) {
	expect(Bytes.eq(bytes, sampleBytes)).ok()
}

export const badgeSuite = Science.suite({
	"bytes->string->bytes": test(async() => {
		const text = Badge.string(sampleBytes)
		expect(text).is(sampleBadge)
		good(Badge.bytes(text))
	}),

	"zero bytes": test(async() => {
		const text = Badge.string(new Uint8Array([]))
		expect(text).is("")
		expect(Bytes.eq(Badge.bytes(text), new Uint8Array([]))).ok()
	}),

	"one byte": test(async() => {
		const text = Badge.string(new Uint8Array([0x00]))
		expect(text).is("doz")
		expect(Bytes.eq(Badge.bytes(text), new Uint8Array([0x00]))).ok()
	}),

	"partially": Science.suite({
		"normal": test(async() => expect(Badge.bytes("nodlyn.fasrep:39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k").length).ok()),
		"nothing": test(async() => expect(Badge.bytes("").length).is(0)),
		"no-rest": test(async() => expect(Badge.bytes("nodlyn.fasrep").length).ok()),
		"one-byte": test(async() => expect(Badge.bytes("nod").length).is(1)),
		"three-byte": test(async() => expect(Badge.bytes("nodlynfas").length).is(3)),
		"one-byte-lead": test(async() => expect(Badge.bytes("nod:39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k").length).ok()),
	}),

	"tolerance": Science.suite({
		"normal": test(async() => good(Badge.bytes("nodlyn.fasrep:39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"spaces": test(async() => good(Badge.bytes("nodlyn fasrep 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"dots": test(async() => good(Badge.bytes("nodlyn.fasrep.39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"one-space": test(async() => good(Badge.bytes("nodlynfasrep 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"one-newline": test(async() => good(Badge.bytes("nodlynfasrep\n39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"whitespace": test(async() => good(Badge.bytes("\t\n nodlyn\n fasrep \n\n\t\n 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k\n\t"))),
	}),
})

