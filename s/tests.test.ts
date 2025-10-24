
import {Science} from "@e280/science"

import data from "./data/data.test.js"
import debounce from "./debounce/debounce.test.js"
import debounceMicrotask from "./debounce/microtask.test.js"
import deep from "./deep/index.test.js"
import queue from "./queue/queue.test.js"
import toq from "./toq/toq.test.js"

await Science.run({
	data,
	debounce,
	debounceMicrotask,
	deep,
	queue,
	toq,
})

