import { get, put } from './requestParser'

describe('GET', () => {
	it(`should return 'observe' if 'observe' parameter is 0`, () => {
		expect(get(0, 'application/link-format')).toBe('observe')
	})

	it(`should return 'cancelObserve' if 'observe' parameter is 1`, () => {
		expect(get(1, 'application/link-format')).toBe('cancelObserve')
	})

	it(`should return 'discover' if 'accept' parameter is 'application/link-format'`, () => {
		expect(get(3, 'application/link-format')).toBe('discover')
	})

	it(`should return 'read' as default value`, () => {
		expect(get(3, '')).toBe('read')
	})
})

describe('PUT', () => {
	it(`should return 'write' if 'content format' parameter is true`, () => {
		expect(put(true)).toBe('write')
	})

	it(`should return 'writeAttr' if 'content format' parameter is false`, () => {
		expect(put(false)).toBe('writeAttr')
	})
})
