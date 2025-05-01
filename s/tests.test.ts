
import {Science} from "@e280/science"
import {badgeSuite} from "./data/barname/badge.test.js"
import {barnameSuite} from "./data/barname/barname.test.js"

await Science.run({
	barname: barnameSuite,
	badge: badgeSuite,
})

