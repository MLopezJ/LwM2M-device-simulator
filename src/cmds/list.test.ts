import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import { list } from '../cmds/list.js'

describe('List', () => {
	it('Should list all the object list when no URL is provided', async () => {
		const param = undefined
		expect(await list(param, assetTrackerFirmwareV2)).toMatchObject(
			assetTrackerFirmwareV2,
		)
	})

	it('Should list object (single instance)', async () => {
		const param = '/3'
		expect(await list(param, assetTrackerFirmwareV2)).toMatchObject(
			assetTrackerFirmwareV2[Device_3_urn] ?? '',
		)
	})

	it('Should return undefined when request for a no existing instance of a single instance object', async () => {
		const param = '/3/1'
		expect(await list(param, assetTrackerFirmwareV2)).toBe(undefined)
	})

	it('Should list object (multiple instance)', async () => {
		const param = '/3303'
		expect(await list(param, assetTrackerFirmwareV2)).toMatchObject(
			assetTrackerFirmwareV2[Temperature_3303_urn] ?? '',
		)
	})

	it('Should return undefined when request for a no existing instance of a multiple instance object', async () => {
		const param = '/3303/10'
		expect(await list(param, assetTrackerFirmwareV2)).toBe(undefined)
	})

	it('Should list resource (single instance object)', async () => {
		const param = '/3/0/0'
		expect(await list(param, assetTrackerFirmwareV2)).toBe('Nordic')
	})

	it('Should return undefined when request for a no existing resource of a single instance object', async () => {
		const param = '/3/0/1010101010'
		expect(await list(param, assetTrackerFirmwareV2)).toBe(undefined)
	})

	it('Should list resource (multiple instance)', async () => {
		const param = '/3303/0/5700'
		expect(await list(param, assetTrackerFirmwareV2)).toBe(24.57)
	})

	it('Should return undefined when request for a no existing resource of a multiple instance object', async () => {
		const param = '/3303/0/1010101010'
		expect(await list(param, assetTrackerFirmwareV2)).toBe(undefined)
	})

	it('Should return undefined when input do not follow LwM2M object syntax', async () => {
		const param = 'test'
		expect(await list(param, assetTrackerFirmwareV2)).toBe(undefined)
	})
})
