import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { list } from '../cmds/list.js'

describe('List', () => {
	let objectsList: assetTracker

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
	})

	it('Should list all the object list when no URL is provided', async () => {
		const param = undefined
		expect(await list(param, objectsList)).toMatchObject(objectsList)
	})

	it('Should return undefined when input do not follow LwM2M object syntax', async () => {
		const param = 'test'
		const expectedResult = undefined
		expect(await list(param, objectsList)).toBe(expectedResult)
	})

	describe('single instance', () => {
		it('Should list object', async () => {
			const param = '/3'
			const expectedResult = objectsList[Device_3_urn] ?? ''
			expect(await list(param, objectsList)).toMatchObject(expectedResult)
		})

		it('Should list resource', async () => {
			const param = '/3/0/0'
			const expectedResult = 'Nordic'
			expect(await list(param, objectsList)).toBe(expectedResult)
		})

		it('Should return undefined when request for a no existing instance', async () => {
			const param = '/3/1'
			expect(await list(param, assetTrackerFirmwareV2)).toBe(undefined)
		})

		it('Should return undefined when request for a no existing resource', async () => {
			const param = '/3/0/1010101010'
			const expectedResult = undefined
			expect(await list(param, objectsList)).toBe(expectedResult)
		})
	})

	describe('multiple instance', () => {
		it('Should list object', async () => {
			const param = '/3303'
			const expectedResult = objectsList[Temperature_3303_urn] ?? ''
			expect(await list(param, objectsList)).toMatchObject(expectedResult)
		})

		it('Should list resource', async () => {
			const param = '/3303/0/5700'
			const expectedResult = 24.57
			expect(await list(param, objectsList)).toBe(expectedResult)
		})

		it('Should return undefined when request for a no existing instance', async () => {
			const param = '/3303/10'
			const expectedResult = undefined
			expect(await list(param, objectsList)).toBe(expectedResult)
		})

		it('Should return undefined when request for a no existing resource', async () => {
			const param = '/3303/0/1010101010'
			const expectedResult = undefined
			expect(await list(param, objectsList)).toBe(expectedResult)
		})
	})
})
