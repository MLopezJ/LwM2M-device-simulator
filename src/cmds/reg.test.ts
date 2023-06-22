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

	it(
		'should register device objects',
		async () => {
			const coapServer = new Promise<{ socketPort: number }>((resolve) => {
				server.on('request', (req, res) => {
					res.end()
					resolve({ socketPort: req.rsinfo.port })
				})
			})
				.then(
					async ({ socketPort }) =>
						new Promise<OutgoingMessage>((resolve) => {
							const params = {
								host: 'localhost',
								port: Number(socketPort),
								pathname: '/3/0/0',
								method: 'GET' as CoapMethod,
								options: {
									'Content-Format': 'application/link-format',
								},
							}
							const client = request(params).end()
							resolve(client)
						}),
				)
				.then(
					async (client) =>
						new Promise<void>((resolve) => {
							client.on('response', (req) => {
								resolve(req.payload.toString())
							})
						}),
				)

			await registerDeviceObjects(assetTrackerFirmwareV2)

			await coapServer

			expect(await coapServer).toBe(`{"bn":"/3/0/0","e":[{"sv":"Nordic"}]}`)
		},
		12 * 1000,
	)
})
