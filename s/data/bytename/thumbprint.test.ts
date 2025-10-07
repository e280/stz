
import {Science, test, expect} from "@e280/science"
import {bytes} from "../bytes.js"
import {hex} from "../base-x-codecs.js"
import {thumbprint} from "./thumbprint.js"

const sampleThumbprint = "nodlyn.fasrep.habbud.ralwel.Avo7gFmdWMRHkwsD149mcaBoZdS69iXuJ"
const sampleHex = "88e8c3fad1028fcf6ce5ac491578850f4d833336feca03b608265501c3019d59"
const sampleBytes = hex.toBytes(sampleHex)

function good(b: Uint8Array) {
	expect(bytes.eq(b, sampleBytes)).ok()
}

export default Science.suite({
	"bytes->string->bytes": test(async() => {
		const text = thumbprint.fromBytes(sampleBytes)
		expect(text).is(sampleThumbprint)
		good(thumbprint.toBytes(text))
	}),

	"zero bytes": test(async() => {
		const text = thumbprint.fromBytes(new Uint8Array([]))
		expect(text).is("")
		expect(bytes.eq(thumbprint.toBytes(text), new Uint8Array([]))).ok()
	}),

	"one byte": test(async() => {
		const text = thumbprint.fromBytes(new Uint8Array([0x00]))
		expect(text).is("doz")
		expect(bytes.eq(thumbprint.toBytes(text), new Uint8Array([0x00]))).ok()
	}),

	"partially": Science.suite({
		"normal": test(async() => expect(thumbprint.toBytes(sampleThumbprint).length).ok()),
		"nothing": test(async() => expect(thumbprint.toBytes("").length).is(0)),
		"no-bulk": test(async() => expect(thumbprint.toBytes("nodlyn.fasrep").length).ok()),
		"one-byte": test(async() => expect(thumbprint.toBytes("nod").length).is(1)),
		"three-byte": test(async() => expect(thumbprint.toBytes("nodlynfas").length).is(3)),
		"one-byte-sigil": test(async() => expect(thumbprint.toBytes("nod::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k").length).ok()),
	}),

	"tolerance": Science.suite({
		"normal": test(async() => good(thumbprint.toBytes("nodlyn.fasrep::39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"coolio": test(async() => good(thumbprint.toBytes("nodlyn.fasrep..39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"spaces": test(async() => good(thumbprint.toBytes("nodlyn fasrep 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"dots": test(async() => good(thumbprint.toBytes("nodlyn.fasrep.39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"one-space": test(async() => good(thumbprint.toBytes("nodlynfasrep 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"one-newline": test(async() => good(thumbprint.toBytes("nodlynfasrep\n39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k"))),
		"whitespace": test(async() => good(thumbprint.toBytes("\t\n nodlyn\n fasrep \n\n\t\n 39gfeGFAAnBzH5pkT7EdoETMUMAekG9h1iymk6k\n\t"))),
	}),
})

