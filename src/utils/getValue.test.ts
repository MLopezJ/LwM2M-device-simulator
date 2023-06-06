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
		it('Should return object', () => {
			expect(
				getValue(
					{ objectId: 3, instanceId: undefined, resourceId: undefined },
					'object',
					assetTrackerFirmwareV2,
				),
			).toMatchObject(
				assetTrackerFirmwareV2[
					Device_3_urn
				] as unknown as Partial<assetTracker>,
			)
		})

		it('Should return undefined if object does not exist', () => {
			expect(
				getValue(
					{ objectId: 315, instanceId: undefined, resourceId: undefined },
					'object',
					assetTrackerFirmwareV2,
				),
			).toBe(undefined)
		})
	})

	/**
	 * Instance case
	 */
	describe('Instance case', () => {
		describe('Single case', () => {
			it('Should return instance ', () => {
				expect(
					getValue(
						{ objectId: 3, instanceId: 0, resourceId: undefined },
						'instance',
						assetTrackerFirmwareV2,
					),
				).toMatchObject(
					assetTrackerFirmwareV2[
						Device_3_urn
					] as unknown as Partial<assetTracker>,
				)
			})

			it('Should return undefined when instance does not exist ', () => {
				expect(
					getValue(
						{ objectId: 3, instanceId: 10, resourceId: undefined },
						'instance',
						assetTrackerFirmwareV2,
					),
				).toBe(undefined)
			})
		})

		describe('Multiple case', () => {
			it('Should return instance ', () => {
				const objectList: any = assetTrackerFirmwareV2 // this any is intentional
				const newTemp = {
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
					newTemp,
				]
				expect(
					getValue(
						{ objectId: 3303, instanceId: 1, resourceId: undefined },
						'instance',
						objectList,
					),
				).toMatchObject(newTemp)
			})

			it('Should return undefined when instance does not exist ', () => {
				expect(
					getValue(
						{ objectId: 3303, instanceId: 10, resourceId: undefined },
						'instance',
						assetTrackerFirmwareV2,
					),
				).toBe(undefined)
			})
		})
	})

	/**
	 * Resource case
	 */
	describe('Resource case', () => {
		describe('Single case', () => {
			it('Should return resource ', () => {
				expect(
					getValue(
						{ objectId: 3, instanceId: 0, resourceId: 0 },
						'resource',
						assetTrackerFirmwareV2,
					),
				).toBe('Nordic')
			})

			it('Should return undefined when resource does not exist ', () => {
				expect(
					getValue(
						{ objectId: 3, instanceId: 0, resourceId: 10101010 },
						'resource',
						assetTrackerFirmwareV2,
					),
				).toBe(undefined)
			})
		})

		describe('Multiple case', () => {
			it('Should return resource ', () => {
				expect(
					getValue(
						{ objectId: 3303, instanceId: 0, resourceId: 5700 },
						'resource',
						assetTrackerFirmwareV2,
					),
				).toBe(24.57)
			})

			it('Should return undefined when resource does not exist ', () => {
				expect(
					getValue(
						{ objectId: 3303, instanceId: 0, resourceId: 10101010 },
						'resource',
						assetTrackerFirmwareV2,
					),
				).toBe(undefined)
			})
		})
	})
})
