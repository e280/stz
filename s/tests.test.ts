
import {Science} from "@e280/science"

import data from "./data/data.test.js"
import debounce from "./debounce/debounce.test.js"
import microbounce from "./debounce/microbounce.test.js"
import deep from "./deep/index.test.js"
import queue from "./queue/queue.test.js"
import toq from "./toq/toq.test.js"
import maybe from "./maybe/test.js"
import dig from "./dig/test.js"
import ok from "./ok/test.js"

await Science.run({
	data,
	debounce,
	microbounce,
	deep,
	queue,
	toq,
	maybe,
	dig,
	ok,
})

