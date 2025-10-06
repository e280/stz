
import {expect, Science, test} from "@e280/science"
import {Txt} from "../data/txt.js"
import {Bytes} from "../data/bytes.js"
import {toq, ToqItem, untoq} from "./toq.js"

export default Science.suite({
	"roundtrip one file": test(async() => {
		const a = "hello.txt"
		const b = "hello world"
		const pack = toq([a, Txt.toBytes(b)])
		const [[name, data]] = untoq(pack)
		expect(name).is(a)
		expect(Txt.fromBytes(data)).is(b)
	}),

	"roundtrip two files": test(async() => {
		const a: ToqItem[] = [
			["hello.txt", Txt.toBytes("hello world")],
			["data.binary", new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])],
		]
		const b = [...untoq(toq(...a))]
		expect(a[0][0]).is(b[0][0])
		expect(Bytes.eq(a[0][1], b[0][1])).is(true)
		expect(a[1][0]).is(b[1][0])
		expect(Bytes.eq(a[1][1], b[1][1])).is(true)
	}),
})

