import { createServer, Server } from 'coap'
import { randomUUID } from 'crypto'
import { heartbeat, type heartbeatParams } from './heartbeat'

describe('heartbeat', () => {
	let server: Server

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
	})

	it('should extend the lifetime of a connection between the client and the server', async () => {
		// Given a request arrives, server answers
		const request = new Promise<{ statusCode: string }>((resolve) => {
			server.on('request', (req, res) => {
				res.end()
				resolve({ statusCode: res.statusCode })
			})
		})

		const deviceName = randomUUID()
		const params: heartbeatParams = {
			deviceName: deviceName,
			lifetime: '3600',
			port: 5683,
			host: 'localhost',
		}

		// When heartbeat is requested
		await heartbeat(params)

		const result = await request

		// The client should sent the correct answer
		expect(result.statusCode).toBe(`2.05`)
	})
})
