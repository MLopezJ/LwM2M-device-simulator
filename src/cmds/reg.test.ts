import { OutgoingMessage, Server, createServer, request } from 'coap'
import { type CoapMethod } from 'coap-packet'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { registerDeviceObjects } from './reg'

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
					new Promise<void>((resolve) => {
						client.on('response', (req) => {
							resolve(req.payload.toString())
						})
					}),
			)

		await registerDeviceObjects(objectsList)

		const result = {
			bn: '/3/0',
			e: [
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
			],
		}

		expect(await serverExecutionResult).toBe(JSON.stringify(result))
	})

	it('should register resource value', async () => {
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

		await registerDeviceObjects(assetTrackerFirmwareV2, deviceManufacter)

		expect(await serverExecutionResult).toBe(
			`{"bn":"/3/0/0","e":[{"sv":"Nordic"}]}`,
		)
	})
})
