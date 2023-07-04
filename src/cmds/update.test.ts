import {
	Device_3_urn,
	Pushbutton_3347_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Server, createServer } from 'coap'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { send, type sendParams } from './update'

describe('update', () => {
	let server: Server
	let objectsList: assetTracker
	let request: Promise<{ payload: string }>

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
		objectsList = assetTrackerFirmwareV2
		request = new Promise<{ payload: string }>((resolve) => {
			server.on('request', (req, res) => {
				res.end()
				resolve({ payload: req.payload.toString() })
			})
		})
	})

	it('should update a string resource using Send operation from Information Reporting interface', async () => {
		const resourceId = '/3/0/0'
		const inputValue = 'test'
		const input: sendParams = {
			resource: resourceId,
			newValue: inputValue,
			host: 'localhost',
			objectsList: objectsList,
		}

		const expectedPayload = [{ n: resourceId, vs: inputValue }]

		const sendResult = await send(input)
		const newResourceValue = (sendResult as unknown as assetTracker)[
			Device_3_urn
		]?.[0]
		const req = await request

		expect(JSON.parse(req.payload)).toStrictEqual(expectedPayload)
		expect(newResourceValue).toBe(inputValue)
	})

	it('should update a numeric resource using Send operation from Information Reporting interface', async () => {
		const resourceId = '/3/0/6'
		const inputValue = '2'
		const input: sendParams = {
			resource: resourceId,
			newValue: inputValue,
			host: 'localhost',
			objectsList: objectsList,
		}

		const expectedPayload = [{ n: resourceId, v: 2 }]
		const sendResult = await send(input)
		const newResourceValue = (sendResult as unknown as assetTracker)[
			Device_3_urn
		]?.[6]
		const req = await request

		expect(JSON.parse(req.payload)).toStrictEqual(expectedPayload)
		expect(newResourceValue).toBe(2)
	})

	it('should update a boolean resource using Send operation from Information Reporting interface', async () => {
		const resourceId = '/3347/0/5500'
		const inputValue = 'false'
		const input: sendParams = {
			resource: resourceId,
			newValue: inputValue,
			host: 'localhost',
			objectsList: objectsList,
		}

		const expectedPayload = [{ n: resourceId, vb: false }]

		const sendResult = await send(input)
		const newResourceValue = (sendResult as unknown as assetTracker)[
			Pushbutton_3347_urn
		]?.[0]?.[5500]
		const req = await request

		expect(JSON.parse(req.payload)).toStrictEqual(expectedPayload)
		expect(newResourceValue).toBe(false)
	})

	it('should return undefined if resource does not exist', async () => {
		const resourceId = '/1233/8750/140'
		const inputValue = 'test'
		const input: sendParams = {
			resource: resourceId,
			newValue: inputValue,
			host: 'localhost',
			objectsList: objectsList,
		}
		const sendResult = await send(input)
		expect(sendResult).toBe(undefined)
	})
})
