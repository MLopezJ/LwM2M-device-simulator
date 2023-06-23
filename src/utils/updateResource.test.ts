import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { type element } from './getElementPath'
import { updateResource } from './updateResource'

describe('Update Resource', () => {
	let objectsList: assetTracker

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
	})

	describe('single instance case', () => {
		it('Should set new string value to resource', () => {
			// set this new value
			const newValue = 'new value'
			// to this element
			const element: element = {
				objectId: 3,
				instanceId: 0,
				resourceId: 0,
			}
			// located here
			const list = objectsList

			const result = updateResource(newValue, element, list)
			expect(result?.[Device_3_urn]?.['0']).toBe(newValue)
		})

		it('Should set new numeric value to resource', () => {
			// set this new value
			const newValue = '100'
			// to this element
			const element: element = {
				objectId: 3,
				instanceId: 0,
				resourceId: 9,
			}
			// located here
			const list = objectsList

			const result = updateResource(newValue, element, list)
			expect(result?.[Device_3_urn]?.['9']).toBe(Number(newValue))
		})
	})

	describe('multiple instance case', () => {
		it('Should set new string value to resource ', () => {
			// set this new value
			const newValue = 'new value'
			// to this element
			const element: element = {
				objectId: 3303,
				instanceId: 0,
				resourceId: 5701,
			}
			// located here
			const list = assetTrackerFirmwareV2

			const result = updateResource(newValue, element, list)
			expect(result?.[Temperature_3303_urn]?.[0]?.['5701']).toBe(newValue)
		})

		it('Should set new numeric value to resource ', () => {
			// set this new value
			const newValue = '100'
			// to this element
			const element: element = {
				objectId: 3303,
				instanceId: 0,
				resourceId: 5700,
			}
			// located here
			const list = assetTrackerFirmwareV2

			const result = updateResource(newValue, element, list)
			expect(result?.[Temperature_3303_urn]?.[0]?.['5700']).toBe(
				Number(newValue),
			)
		})
	})

	describe('not correct cases', () => {
		it.each([
			[
				'object',
				{
					objectId: 10101, // object does not exist
					instanceId: 0,
					resourceId: 0,
				},
			],
			[
				'instance',
				{
					objectId: 3,
					instanceId: 10101, // instance does not exist
					resourceId: 0,
				},
			],
			[
				'resource',
				{
					objectId: 3,
					instanceId: 0,
					resourceId: 10101, // resource does not exist
				},
			],
			[
				'instance',
				{
					objectId: 3303,
					instanceId: 10101, // instance does not exist
					resourceId: 0,
				},
			],
			[
				'resource',
				{
					objectId: 3303,
					instanceId: 0,
					resourceId: 10101, // resource does not exist
				},
			],
		])(
			'Should return undefined when %p does not exist in input list: %p',
			(typeCase: string, element: element) => {
				const newValue = 'new value'
				const list = assetTrackerFirmwareV2
				const result = updateResource(newValue, element, list)
				expect(result).toBe(undefined)
			},
		)
	})
})
