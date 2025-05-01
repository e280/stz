
import {Science} from "@e280/science"
import {badgeSuite} from "./data/bytename/badge.test.js"
import {bytenameSuite} from "./data/bytename/bytename.test.js"

await Science.run({
	bytename: bytenameSuite,
	badge: badgeSuite,
})

