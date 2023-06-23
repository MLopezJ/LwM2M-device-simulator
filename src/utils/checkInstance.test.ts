import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { checkInstance } from './checkInstance.js'

describe('Check Instance', () => {
	let objectsList: assetTracker

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
	})

	describe('single instance', () => {
		it('Should return instance if it exists', () => {
			const list = objectsList
			const result = checkInstance(list[Device_3_urn], 0)
			const instance = list[Device_3_urn] ?? ''
			expect(result).toMatchObject(instance)
		})

		it('Should return undefined when instance does not exist in object', () => {
			const list = objectsList
			const result = checkInstance(list[Device_3_urn], 30)
			expect(result).toBe(undefined)
		})
	})

	describe('multiple instance', () => {
		it('Should return instance if it exists', () => {
			const list = objectsList
			const result = checkInstance(list[Temperature_3303_urn], 0)
			const instance = list[Temperature_3303_urn]?.[0] ?? ''
			expect(result).toMatchObject(instance)
		})

		it('Should return undefined when instance does not exist in object', () => {
			const list = objectsList
			const result = checkInstance(list[Temperature_3303_urn], 30)
			expect(result).toBe(undefined)
		})
	})
})
