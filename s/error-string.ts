
export function errorString(error: unknown, fallback = "error"): string {
	if (typeof error === "string") return error
	else if (error instanceof Error) return error.message
	else return fallback
}

