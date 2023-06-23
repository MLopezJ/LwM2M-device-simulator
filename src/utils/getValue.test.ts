import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { getValue } from './getValue.js'

describe('getValue', () => {
	/**
	 * Object case
	 */
	describe('Object case', () => {
		it('Should return object value', async () => {
			const request = 'object'
			const element = {
				objectId: 3,
				instanceId: undefined,
				resourceId: undefined,
			}
			const from = assetTrackerFirmwareV2

			expect(await getValue(request, element, from)).toMatchObject(
				assetTrackerFirmwareV2[
					Device_3_urn
				] as unknown as Partial<assetTracker>,
			)
		})

		it('Should return undefined if object does not exist', async () => {
			const request = 'object'
			const element = {
				objectId: 315,
				instanceId: undefined,
				resourceId: undefined,
			}
			const from = assetTrackerFirmwareV2

			expect(await getValue(request, element, from)).toBe(undefined)
		})
	})

	/**
	 * Instance case
	 */
	describe('Instance case', () => {
		describe('Single case', () => {
			it('Should return instance value', async () => {
				const request = 'instance'
				const element = { objectId: 3, instanceId: 0, resourceId: undefined }
				const from = assetTrackerFirmwareV2

				expect(await getValue(request, element, from)).toMatchObject(
					assetTrackerFirmwareV2[
						Device_3_urn
					] as unknown as Partial<assetTracker>,
				)
			})

			it('Should return undefined when instance does not exist ', async () => {
				const request = 'instance'
				const element = { objectId: 3, instanceId: 10, resourceId: undefined }
				const from = assetTrackerFirmwareV2

				expect(await getValue(request, element, from)).toBe(undefined)
			})
		})

		describe('Multiple case', () => {
			it('Should return instance value', async () => {
				const objectList: any = assetTrackerFirmwareV2 // TODO: remove this any
				const newTemperatureInstance = {
					'5518': 1665149633,
					'5601': 23.51,
					'5602': 23.51,
					'5603': -40,
					'5604': 85,
					'5700': 10,
					'5701': 'Celsius degrees',
				}
				objectList[Temperature_3303_urn as keyof assetTracker] = [
					...(assetTrackerFirmwareV2[Temperature_3303_urn] ?? ''),
					newTemperatureInstance,
				]

				const request = 'instance'
				const element = { objectId: 3303, instanceId: 1, resourceId: undefined }
				const from = objectList

				expect(await getValue(request, element, from)).toMatchObject(
					newTemperatureInstance,
				)
			})

			it('Should return undefined when instance does not exist ', async () => {
				const request = 'instance'
				const element = {
					objectId: 3303,
					instanceId: 10,
					resourceId: undefined,
				}
				const from = assetTrackerFirmwareV2

				expect(await getValue(request, element, from)).toBe(undefined)
			})
		})
	})

	/**
	 * Resource case
	 */
	describe('Resource case', () => {
		describe('Single case', () => {
			it('Should return resource value', async () => {
				const request = 'resource'
				const element = { objectId: 3, instanceId: 0, resourceId: 0 }
				const from = assetTrackerFirmwareV2

				expect(await getValue(request, element, from)).toBe('Nordic')
			})

			it('Should return undefined when resource does not exist ', async () => {
				const request = 'resource'
				const element = { objectId: 3, instanceId: 0, resourceId: 10101010 }
				const from = assetTrackerFirmwareV2

				expect(await getValue(request, element, from)).toBe(undefined)
			})
		})

		describe('Multiple case', () => {
			const request = 'resource'
			const element = { objectId: 3303, instanceId: 0, resourceId: 5700 }
			const from = assetTrackerFirmwareV2

			it('Should return resource value', async () => {
				expect(await getValue(request, element, from)).toBe(24.57)
			})

			it('Should return undefined when resource does not exist ', async () => {
				const request = 'resource'
				const element = { objectId: 3303, instanceId: 0, resourceId: 10101010 }
				const from = assetTrackerFirmwareV2

				expect(await getValue(request, element, from)).toBe(undefined)
			})
		})
	})
})
