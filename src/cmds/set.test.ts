import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import { set } from '../cmds/set.js'
import type { element } from '../utils/getElementPath.js'

describe('Set', () => {
	describe('single instance case', () => {
		it('Should set new value to resource', () => {
			const element: element = {
				objectId: 3,
				instanceId: 0,
				resourceId: 0,
			}
			const value = 'new value'
			const list = assetTrackerFirmwareV2
			const result = set(list, element, value)
			expect(result?.[Device_3_urn]?.['0']).toBe(value)
		})

		it('Should set new numeric value to resource', () => {
			const element: element = {
				objectId: 3,
				instanceId: 0,
				resourceId: 9,
			}
			const value = '100'
			const list = assetTrackerFirmwareV2
			const result = set(list, element, value)
			expect(result?.[Device_3_urn]?.['9']).toBe(Number(value))
		})
	})

	describe('multiple instance case', () => {
		it('Should set new value to resource ', () => {
			const element: element = {
				objectId: 3303,
				instanceId: 0,
				resourceId: 5701,
			}
			const value = 'new value'
			const list = assetTrackerFirmwareV2
			const result = set(list, element, value)
			expect(result?.[Temperature_3303_urn]?.[0]?.['5701']).toBe(value)
		})

		it('Should set new numeric value to resource ', () => {
			const element: element = {
				objectId: 3303,
				instanceId: 0,
				resourceId: 5700,
			}
			const value = '100'
			const list = assetTrackerFirmwareV2
			const result = set(list, element, value)
			expect(result?.[Temperature_3303_urn]?.[0]?.['5700']).toBe(Number(value))
		})
	})

	describe('not correct cases', () => {
		it.each([
			[
				'object',
				{
					objectId: 10101, // object do not exist
					instanceId: 0,
					resourceId: 0,
				},
			],
			[
				'instance',
				{
					objectId: 3,
					instanceId: 10101, // instance do not exist
					resourceId: 0,
				},
			],
			[
				'resource',
				{
					objectId: 3,
					instanceId: 0,
					resourceId: 10101, // resource do not exist
				},
			],
			[
				'instance',
				{
					objectId: 3303,
					instanceId: 10101, // instance do not exist
					resourceId: 0,
				},
			],
			[
				'resource',
				{
					objectId: 3303,
					instanceId: 0,
					resourceId: 10101, // resource do not exist
				},
			],
		])(
			'Should return undefined when %p do not exist in input list: %p',
			(typeCase: string, element: element) => {
				const value = 'new value'
				const list = assetTrackerFirmwareV2
				const result = set(list, element, value)
				expect(result).toBe(undefined)
			},
		)
	})
})
