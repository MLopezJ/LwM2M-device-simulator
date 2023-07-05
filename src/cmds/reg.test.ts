import { OutgoingMessage, Server, createServer, request } from 'coap'
import { type CoapMethod } from 'coap-packet'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { registerDeviceObjects, type registrationParams } from './reg'

describe('registerDeviceObjects', () => {
	let server: Server
	let objectsList: assetTracker

	beforeEach(async () => {
		objectsList = assetTrackerFirmwareV2
		server = createServer()
		server.listen(5683)
	})

	it('should register device object', async () => {
		const requestResourceValue = (socketPort: number, resource: string) => {
			const params = {
				host: 'localhost',
				port: socketPort,
				pathname: resource,
				method: 'GET' as CoapMethod,
				options: {
					'Content-Format': 'application/link-format',
				},
			}
			return request(params).end()
		}

		const serverExecutionResult = new Promise<{ socketPort: number }>(
			(resolve) => {
				// receive client handshake
				server.on('request', (req, res) => {
					res.end()
					resolve({ socketPort: req.rsinfo.port })
				})
			},
		)
			.then(
				async ({ socketPort }) =>
					// Request resource value to the client
					new Promise<OutgoingMessage>((resolve) =>
						resolve(requestResourceValue(socketPort, '/3/0')),
					),
			)
			.then(
				async (client) =>
					// wait for client's response
					new Promise<string>((resolve) => {
						client.on('response', (req) => {
							resolve(req.payload.toString())
						})
					}),
			)

		const params: registrationParams = {
			deviceObjects: objectsList,
			resource: undefined,
			deviceName: 'test',
			lifetime: '3600',
			biding: 'U',
			port: 5683,
			host: 'localhost',
			lwm2mV: '1.1',
		}
		await registerDeviceObjects(params)

		const expected = {
			bn: '/3/0',
			// bt: ...
			e: [
				{ n: '0', sv: 'Nordic' }, // t: ..
				{ n: '1', sv: '00010' }, // t: ..
				{ n: '2', sv: '00000' }, // t: ..
				{ n: '3', sv: '0.0' }, // t: ..
				{ n: '6', v: 1 }, // t: ..
				{ n: '7', v: 0 }, // t: ..
				{ n: '9', v: 80 }, // t: ..
				{ n: '11', v: 0 }, // t: ..
				{ n: '16', sv: 'U' }, // t: ..
				{ n: '18', sv: '0.0' }, // t: ..
				{ n: '19', sv: '0.0' }, // t: ..
			],
		}

		const serverResult = await serverExecutionResult
		const result = JSON.parse(serverResult)

		expect(result).toMatchObject(expected)
		expect(result.bt).not.toBe(undefined)
		expect(result.e[0].t).not.toBe(undefined)
	})

	it.skip('should register resource value', async () => {
		const deviceManufacter = '/3/0/0'

		const requestResourceValue = (socketPort: number, resource: string) => {
			const params = {
				host: 'localhost',
				port: socketPort,
				pathname: resource,
				method: 'GET' as CoapMethod,
				options: {
					'Content-Format': 'application/link-format',
				},
			}
			return request(params).end()
		}

		const serverExecutionResult = new Promise<{ socketPort: number }>(
			(resolve) => {
				// receive client handshake
				server.on('request', (req, res) => {
					res.end()
					resolve({ socketPort: req.rsinfo.port })
				})
			},
		)
			.then(
				async ({ socketPort }) =>
					// Request resource value to the client
					new Promise<OutgoingMessage>((resolve) =>
						resolve(requestResourceValue(socketPort, deviceManufacter)),
					),
			)
			.then(
				async (client) =>
					// wait for client's response
					new Promise<void>((resolve) => {
						client.on('response', (req) => {
							resolve(req.payload.toString())
						})
					}),
			)

		const params: registrationParams = {
			deviceObjects: objectsList,
			resource: deviceManufacter,
			deviceName: 'test',
			lifetime: '3600',
			biding: 'U',
			port: 5683,
			host: 'localhost',
			lwm2mV: '1.1',
		}
		await registerDeviceObjects(params)

		expect(await serverExecutionResult).toBe(
			`{"bn":"/3/0/0","e":[{"sv":"Nordic"}]}`,
		)
	})
})
