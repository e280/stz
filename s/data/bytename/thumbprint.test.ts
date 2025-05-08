
import {Science, test, expect} from "@e280/science"
import {Hex} from "../hex.js"
import {Bytes} from "../bytes.js"
import {Thumbprint} from "./thumbprint.js"

const sampleThumbprint = "nodlyn.fasrep::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"
const sampleHex = "88e8c3fad1028fcf6ce5ac491578850f4d833336feca03b608265501c3019d59"
const sampleBytes = Hex.bytes(sampleHex)

function good(bytes: Uint8Array) {
	expect(Bytes.eq(bytes, sampleBytes)).ok()
}

export default Science.suite({
	"bytes->string->bytes": test(async() => {
		const text = Thumbprint.fromBytes(sampleBytes)
		expect(text).is(sampleThumbprint)
		good(Thumbprint.toBytes(text))
	}),

	"zero bytes": test(async() => {
		const text = Thumbprint.fromBytes(new Uint8Array([]))
		expect(text).is("")
		expect(Bytes.eq(Thumbprint.toBytes(text), new Uint8Array([]))).ok()
	}),

	"one byte": test(async() => {
		const text = Thumbprint.fromBytes(new Uint8Array([0x00]))
		expect(text).is("doz")
		expect(Bytes.eq(Thumbprint.toBytes(text), new Uint8Array([0x00]))).ok()
	}),

	"partially": Science.suite({
		"normal": test(async() => expect(Thumbprint.toBytes("nodlyn.fasrep::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k").length).ok()),
		"nothing": test(async() => expect(Thumbprint.toBytes("").length).is(0)),
		"no-bulk": test(async() => expect(Thumbprint.toBytes("nodlyn.fasrep").length).ok()),
		"one-byte": test(async() => expect(Thumbprint.toBytes("nod").length).is(1)),
		"three-byte": test(async() => expect(Thumbprint.toBytes("nodlynfas").length).is(3)),
		"one-byte-sigil": test(async() => expect(Thumbprint.toBytes("nod::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k").length).ok()),
	}),

	"tolerance": Science.suite({
		"normal": test(async() => good(Thumbprint.toBytes("nodlyn.fasrep::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"coolio": test(async() => good(Thumbprint.toBytes("nodlyn.fasrep..39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"spaces": test(async() => good(Thumbprint.toBytes("nodlyn fasrep 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"dots": test(async() => good(Thumbprint.toBytes("nodlyn.fasrep.39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"one-space": test(async() => good(Thumbprint.toBytes("nodlynfasrep 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"one-newline": test(async() => good(Thumbprint.toBytes("nodlynfasrep\n39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"whitespace": test(async() => good(Thumbprint.toBytes("\t\n nodlyn\n fasrep \n\n\t\n 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k\n\t"))),
	}),
})

