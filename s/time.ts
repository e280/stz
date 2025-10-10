
export const time = {
	seconds: (n: number) => (n * 1000),
	minutes: (n: number) => (n * time.seconds(60)),
	hours: (n: number) => (n * time.minutes(60)),
	days: (n: number) => (n * time.hours(24)),

	future: {
		seconds: (n: number) => (Date.now() + time.seconds(n)),
		minutes: (n: number) => (Date.now() + time.minutes(n)),
		hours: (n: number) => (Date.now() + time.hours(n)),
		days: (n: number) => (Date.now() + time.days(n)),
	},

	past: {
		seconds: (n: number) => (Date.now() - time.seconds(n)),
		minutes: (n: number) => (Date.now() - time.minutes(n)),
		hours: (n: number) => (Date.now() - time.hours(n)),
		days: (n: number) => (Date.now() - time.days(n)),
	},
}

/** @deprecated renamed to `time` */
export const Time = time

