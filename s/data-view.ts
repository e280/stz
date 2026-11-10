
export function dataView(data: ArrayBufferView) {
	return new DataView(data.buffer, data.byteOffset, data.byteLength)
}

/** @deprecated renamed to `dataView` */
export const dataViewFrom = dataView

