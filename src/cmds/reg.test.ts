import { OutgoingMessage, Server, createServer, request } from 'coap'
import { type CoapMethod } from 'coap-packet'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2'
import { registerDeviceObjects } from './reg'

describe('registerDeviceObjects', () => {
	let server: Server

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
	})

	it('should register device objects', async () => {
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
						resolve(requestResourceValue(socketPort, '/3/0/0')),
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

		await registerDeviceObjects(assetTrackerFirmwareV2)

		expect(await serverExecutionResult).toBe(
			`{"bn":"/3/0/0","e":[{"sv":"Nordic"}]}`,
		)
	})
})
