import { Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import { createServer, Server } from 'coap'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { send, type sendParams } from './update'

describe('update', () => {
	let server: Server
	let objectsList: assetTracker

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
		objectsList = assetTrackerFirmwareV2
	})

	it('should update a resource using Send operation from Information Reporting interface', async () => {
		const request = new Promise<{ payload: string }>((resolve) => {
			server.on('request', (req, res) => {
				res.end()
				resolve({ payload: req.payload.toString() })
			})
		})

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
