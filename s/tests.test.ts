
import {Science} from "@e280/science"

import clone from "./clone/clone.test.js"
import thumbprint from "./data/bytename/thumbprint.test.js"
import debounce from "./debounce/debounce.test.js"
import bytename from "./data/bytename/bytename.test.js"
import deep from "./deep/deep.test.js"
import data from "./data/data.test.js"

await Science.run({
	clone,
	bytename,
	thumbprint,
	debounce,
	deep,
	data,
})

