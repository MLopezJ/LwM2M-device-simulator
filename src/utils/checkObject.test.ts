import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { checkObject } from './checkObject.js'
import type { element } from './getElementPath'

describe('Check Object', () => {
	let objectsList: assetTracker

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
	})

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
	])('Should check that object %p exist in given list', (path: element) =>
		expect(checkObject(path, objectsList)).not.toBe(undefined),
	)

	it('Should return undefined when object does not exist in given list', () => {
		const path: element = {
			objectId: 101010101,
			instanceId: undefined,
			resourceId: undefined,
		}
		expect(checkObject(path, objectsList)).toBe(undefined)
	})
})
