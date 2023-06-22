import {
	Device_3_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import { createResourceList, type e } from './createResourceList.js'

describe('createResourceList', () => {
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
				{ n: '0/0', sv: 'Nordic' },
				{ n: '0/1', sv: '00010' },
				{ n: '0/2', sv: '00000' },
				{ n: '0/3', sv: '0.0' },
				{ n: '0/6', v: 1 },
				{ n: '0/7', v: 0 },
				{ n: '0/9', v: 80 },
				{ n: '0/11', v: 0 },
				{ n: '0/16', sv: 'U' },
				{ n: '0/18', sv: '0.0' },
				{ n: '0/19', sv: '0.0' },
			]

			expect(createResourceList(input, 'object')).toMatchObject(expected)
		})

		it('Should return empty array when input is an empty object', () =>
			expect(createResourceList({}, 'object').length).toBe(0))

		it('Should create the expected format from resource', () => {
			const elementPath = { objectId: 3, instanceId: 0, resourceId: 0 }
			const result = createResourceList(
				assetTrackerFirmwareV2[Device_3_urn] ?? {},
				'resource',
				elementPath,
			)
			const expected: e[] = [{ sv: 'Nordic' }]
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

			const result = createResourceList(multipleInstance, 'object')
			expect(result).toMatchObject(expected)
			expect(result[0]).toHaveProperty('n', '0/5700')
			expect(result[0]).toHaveProperty('v', 24.57)
			expect(result[5]).toHaveProperty('n', '2/5701')
			expect(result[5]).toHaveProperty('sv', 'Celsius degrees')
		})

		it('Should return empty array when input is an empty object', () => {
			const emptyMultipleInstance = [{}]
			const result = createResourceList(emptyMultipleInstance, 'object')
			expect(result.length).toBe(0)
		})

		it('Should create the expected format from resource', () => {
			const elementPath = { objectId: 3303, instanceId: 0, resourceId: 5700 }
			const result = createResourceList(
				assetTrackerFirmwareV2[Temperature_3303_urn] ?? {},
				'resource',
				elementPath,
			)
			const expected: e[] = [{ v: 24.57 }]
			expect(result).toMatchObject(expected)
		})
	})

	it('Should create the expected format from instance', () => {
		const result = createResourceList(
			assetTrackerFirmwareV2[Device_3_urn] ?? {},
			'instance',
		)

		const expected: e[] = [
			{ n: '0', sv: 'Nordic' },
			{ n: '1', sv: '00010' },
			{ n: '2', sv: '00000' },
			{ n: '3', sv: '0.0' },
			{ n: '6', v: 1 },
			{ n: '7', v: 0 },
			{ n: '9', v: 80 },
			{ n: '11', v: 0 },
			{ n: '16', sv: 'U' },
			{ n: '18', sv: '0.0' },
			{ n: '19', sv: '0.0' },
		]
		expect(result).toMatchObject(expected)
	})
})
