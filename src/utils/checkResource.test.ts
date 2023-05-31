import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { checkResource } from './checkResource.js'

describe('Check Resource', () => {
	it('Should return resource value if resource exist', () => {
		expect(checkResource(assetTrackerFirmwareV2[Device_3_urn] ?? {}, 0)).toBe(
			'Nordic',
		)
	})

	it.each([
		[1, 'Device', assetTrackerFirmwareV2[Device_3_urn]],
		[
			5700,
			'Temperature',
			assetTrackerFirmwareV2[Temperature_3303_urn]
				? assetTrackerFirmwareV2[Temperature_3303_urn][0]
				: {},
		],
	])(
		'Should check that resource %p exist in object: %p',
		(resourceId: number, objectName: string, object: unknown) => {
			expect(checkResource(object as assetTracker, resourceId)).not.toBe(
				undefined,
			)
		},
	)

	it.each([
		[404, 'Device', assetTrackerFirmwareV2[Device_3_urn]],
		[
			10101010,
			'Temperature',
			assetTrackerFirmwareV2[Temperature_3303_urn]
				? assetTrackerFirmwareV2[Temperature_3303_urn][0]
				: {},
		],
	])(
		'Should check that resource %p do not exist in object: %p',
		(resourceId: number, objectName: string, object: unknown) => {
			expect(checkResource(object as Partial<assetTracker>, resourceId)).toBe(
				undefined,
			)
		},
	)
})
