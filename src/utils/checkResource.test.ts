import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import { checkResource } from './checkResource.js'
import { type instance } from './getValue.js'

describe('Check Resource', () => {
	it('Should return resource value if it exists', () => {
		const list = assetTrackerFirmwareV2
		const object = list[Device_3_urn] ?? {}
		const resourceId = 0
		expect(checkResource(object, resourceId)).toBe('Nordic')
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
		(resourceId: number, objectName: string, object: instance) => {
			expect(checkResource(object, resourceId)).not.toBe(undefined)
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
		'Should check that resource %p does not exist in object: %p',
		(resourceId: number, objectName: string, object: instance) => {
			expect(checkResource(object, resourceId)).toBe(undefined)
		},
	)
})
