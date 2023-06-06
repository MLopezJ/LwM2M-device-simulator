import { getElementPath } from './getElementPath.js'

describe('getElementPath', () => {
	it.each([
		['/4', { objectId: 4, instanceId: undefined, resourceId: undefined }],
		['/3303/2', { objectId: 3303, instanceId: 2, resourceId: undefined }],
		['/3/0/1', { objectId: 3, instanceId: 0, resourceId: 1 }],
		['/3303/10/5700', { objectId: 3303, instanceId: 10, resourceId: 5700 }],
	])('Should split path in different ids: %p', (path: string, obj: object) => {
		expect(getElementPath(path)).toMatchObject(obj)
	})

	it('Should return ids with undefined if is not possible to get information from input', () => {
		expect(getElementPath('')).toMatchObject({
			objectId: undefined,
			instanceId: undefined,
			resourceId: undefined,
		})
	})
})
