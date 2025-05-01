
import {Science} from "@e280/science"

import cloneTest from "./clone/clone.test.js"
import badgeTest from "./data/bytename/badge.test.js"
import debounceTest from "./debounce/debounce.test.js"
import bytenameTest from "./data/bytename/bytename.test.js"
import deepTest from "./deep/deep.test.js"

await Science.run({
	clone: cloneTest,
	bytename: bytenameTest,
	badge: badgeTest,
	debounce: debounceTest,
	deep: deepTest,
})

