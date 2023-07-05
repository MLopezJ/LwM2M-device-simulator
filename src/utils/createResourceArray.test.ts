import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2.js'
import { createResourceArray, type e } from './createResourceArray.js'

describe('createResourceArray', () => {
	let objectsList: assetTracker
	let time: number

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
		time = Math.floor(Date.now() / 1000)
	})

	describe('single instance', () => {
		it('Should create the expected format from object', () => {
			const input = {
				'0': 'Nordic',
				'1': '00010',
				'2': '00000',
				'3': '0.0',
				'6': 1,
				'7': 0,
				'9': 80,
				'11': 0,
				'16': 'U',
				'18': '0.0',
				'19': '0.0',
			}

			const expected: e[] = [
				{ n: '0/0', sv: 'Nordic', t: time },
				{ n: '0/1', sv: '00010', t: time },
				{ n: '0/2', sv: '00000', t: time },
				{ n: '0/3', sv: '0.0', t: time },
				{ n: '0/6', v: 1, t: time },
				{ n: '0/7', v: 0, t: time },
				{ n: '0/9', v: 80, t: time },
				{ n: '0/11', v: 0, t: time },
				{ n: '0/16', sv: 'U', t: time },
				{ n: '0/18', sv: '0.0', t: time },
				{ n: '0/19', sv: '0.0', t: time },
			]

			expect(createResourceArray(input, 'object', time)).toMatchObject(expected)
		})

		it('Should return empty array when input is an empty object', () =>
			expect(createResourceArray({}, 'object', time).length).toBe(0))

		it('Should create the expected format from resource', () => {
			const elementPath = { objectId: 3, instanceId: 0, resourceId: 0 }
			const resource = objectsList[Device_3_urn] ?? {}
			const result = createResourceArray(
				resource,
				'resource',
				time,
				elementPath,
			)
			const expected: e[] = [{ sv: 'Nordic', t: time }]
			expect(result).toMatchObject(expected)
		})
	})

	describe('multiple instance', () => {
		it('Should create the expected format from object', () => {
			const multipleInstance = [
				{ '5700': 24.57, '5701': 'Celsius degrees' },
				{ '5700': 20, '5701': 'Celsius degrees' },
				{ '5700': 27, '5701': 'Celsius degrees' },
			]

			const expected: e[] = [
				{ n: '0/5700', v: 24.57 },
				{ n: '0/5701', sv: 'Celsius degrees' },
				{ n: '1/5700', v: 20 },
				{ n: '1/5701', sv: 'Celsius degrees' },
				{ n: '2/5700', v: 27 },
				{ n: '2/5701', sv: 'Celsius degrees' },
			]

			const result = createResourceArray(multipleInstance, 'object', time)
			expect(result).toMatchObject(expected)
			expect(result[0]).toHaveProperty('n', '0/5700')
			expect(result[0]).toHaveProperty('v', 24.57)
			expect(result[0]).toHaveProperty('t', time)
			expect(result[5]).toHaveProperty('n', '2/5701')
			expect(result[5]).toHaveProperty('sv', 'Celsius degrees')
			expect(result[5]).toHaveProperty('t', time)
		})

		it('Should return empty array when input is an empty object', () => {
			const emptyMultipleInstance = [{}]
			const result = createResourceArray(emptyMultipleInstance, 'object', time)
			expect(result.length).toBe(0)
		})

		it('Should create the expected format from resource', () => {
			const elementPath = { objectId: 3303, instanceId: 0, resourceId: 5700 }
			const resource = objectsList[Temperature_3303_urn] ?? {}
			const result = createResourceArray(
				resource,
				'resource',
				time,
				elementPath,
			)
			const expected: e[] = [{ v: 24.57, t: time }]
			expect(result).toMatchObject(expected)
		})
	})

	it('Should create the expected format from instance', () => {
		const result = createResourceArray(
			objectsList[Device_3_urn] ?? {},
			'instance',
			time,
		)

		const expected: e[] = [
			{ n: '0', sv: 'Nordic', t: time },
			{ n: '1', sv: '00010', t: time },
			{ n: '2', sv: '00000', t: time },
			{ n: '3', sv: '0.0', t: time },
			{ n: '6', v: 1, t: time },
			{ n: '7', v: 0, t: time },
			{ n: '9', v: 80, t: time },
			{ n: '11', v: 0, t: time },
			{ n: '16', sv: 'U', t: time },
			{ n: '18', sv: '0.0', t: time },
			{ n: '19', sv: '0.0', t: time },
		]
		expect(result).toMatchObject(expected)
	})
})
