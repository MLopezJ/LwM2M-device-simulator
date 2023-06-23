import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { checkResource } from './checkResource.js'
import { type instance } from './getValue.js'

describe('Check Resource', () => {
	let objectsList: assetTracker = assetTrackerFirmwareV2

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
	})

	it('Should return resource value if it exists', () => {
		const object = objectsList[Device_3_urn] ?? {}
		const resourceId = 0
		expect(checkResource(object, resourceId)).toBe('Nordic')
	})

	it.each([
		[1, 'Device', objectsList[Device_3_urn]],
		[
			5700,
			'Temperature',
			objectsList[Temperature_3303_urn]
				? objectsList[Temperature_3303_urn][0]
				: {},
		],
	])(
		'Should check that resource %p exist in object: %p',
		(resourceId: number, objectName: string, object: instance) => {
			expect(checkResource(object, resourceId)).not.toBe(undefined)
		},
	)

	it.each([
		[404, 'Device', objectsList[Device_3_urn]],
		[
			10101010,
			'Temperature',
			objectsList[Temperature_3303_urn]
				? objectsList[Temperature_3303_urn][0]
				: {},
		],
	])(
		'Should check that resource %p does not exist in object: %p',
		(resourceId: number, objectName: string, object: instance) => {
			expect(checkResource(object, resourceId)).toBe(undefined)
		},
	)
})
