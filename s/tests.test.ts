
import {Science} from "@e280/science"

import cloneTest from "./clone/clone.test.js"
import thumbprintTest from "./data/bytename/thumbprint.test.js"
import debounceTest from "./debounce/debounce.test.js"
import bytenameTest from "./data/bytename/bytename.test.js"
import deepTest from "./deep/deep.test.js"

await Science.run({
	clone: cloneTest,
	bytename: bytenameTest,
	thumbprint: thumbprintTest,
	debounce: debounceTest,
	deep: deepTest,
})

