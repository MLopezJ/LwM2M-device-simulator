import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import { checkObject } from './checkObject.js'
import type { element } from './getElementPath'

describe('Check Object', () => {
	it.each([
		[
			{
				objectId: 3,
				instanceId: undefined,
				resourceId: undefined,
			},
		],
		[
			{
				objectId: 3303,
				instanceId: undefined,
				resourceId: undefined,
			},
		],
	])('Should check that object %p exist in given list', (path: element) => {
		const list = assetTrackerFirmwareV2
		expect(checkObject(path, list)).not.toBe(undefined)
	})

	it('Should return undefined when object does not exist in given list', () => {
		const path: element = {
			objectId: 101010101,
			instanceId: undefined,
			resourceId: undefined,
		}
		const list = assetTrackerFirmwareV2
		expect(checkObject(path, list)).toBe(undefined)
	})
})
