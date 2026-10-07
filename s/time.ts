
export const seconds = (n: number) => (n * 1000)
export const minutes = (n: number) => (n * seconds(60))
export const hours = (n: number) => (n * minutes(60))
export const days = (n: number) => (n * hours(24))

export const pastSeconds = (n: number) => (Date.now() - seconds(n))
export const pastMinutes = (n: number) => (Date.now() - minutes(n))
export const pastHours = (n: number) => (Date.now() - hours(n))
export const pastDays = (n: number) => (Date.now() - days(n))

export const futureSeconds = (n: number) => (Date.now() + seconds(n))
export const futureMinutes = (n: number) => (Date.now() + minutes(n))
export const futureHours = (n: number) => (Date.now() + hours(n))
export const futureDays = (n: number) => (Date.now() + days(n))

/** @deprecated de-namespaced, see fns like `seconds`, `futureSeconds`, `pastSeconds`. */
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

