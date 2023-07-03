import coap, { createServer, Server } from 'coap'
import { randomUUID } from 'crypto'
import { handshake, type handshakeParams } from './handshake'

describe('handshake', () => {
	let server: Server

	beforeEach(async () => {
		server = createServer()
		server.listen(5683)
	})

	it('should send handshake request to register device objects', async () => {
		// Given a request arrives, server answers
		const request = new Promise<{ url: string; payload: string }>((resolve) => {
			server.on('request', (req, res) => {
				//console.log('Hanshake request sent. This is received by the server here')
				res.end()
				resolve({ url: req.url, payload: req.payload.toString() })
			})
		})

		const deviceName = randomUUID()
		const objects = '<1/0>, <3/0>, <6/0>'
		const params: handshakeParams = {
			agent: new coap.Agent({ type: 'udp4' }),
			objects: '<1/0>, <3/0>, <6/0>',
			deviceName: deviceName,
			lifetime: '3600',
			lwm2mV: '1.1',
			port: 5683,
			host: 'localhost',
			biding: 'U',
		}

		// When I do the request
		await handshake(params)

		const result = await request

		// Then the client should have sent the correct handshake
		expect(result.url).toBe(`/rd?ep=${deviceName}&lt=3600&lwm2m=1.1&b=U`)
		expect(result.payload).toBe(`</>;ct=11543,110;hb,${objects}`)
	})

	it('should send handshake request to register a resource', async () => {
		// Given a request arrives, server answers
		const request = new Promise<{ url: string; payload: string }>((resolve) => {
			server.on('request', (req, res) => {
				//console.log('Hanshake request sent. This is received by the server here')
				res.end()
				resolve({ url: req.url, payload: req.payload.toString() })
			})
		})

		const deviceName = randomUUID()
		const resource = '</3/0/0>'
		const params: handshakeParams = {
			agent: new coap.Agent({ type: 'udp4' }),
			objects: '</3/0/0>',
			deviceName: deviceName,
			lifetime: '3600',
			lwm2mV: '1.1',
			port: 5683,
			host: 'localhost',
			biding: 'U',
		}

		// When I do the request
		await handshake(params)

		const result = await request

		// Then the client should have sent the correct handshake
		expect(result.url).toBe(`/rd?ep=${deviceName}&lt=3600&lwm2m=1.1&b=U`)
		expect(result.payload).toBe(`</>;ct=11543,110;hb,${resource}`)
	})

	it('should handle internal server error handshake response ', async () => {
		// Given, the server responds with an internal server error
		server.on('request', (req, res) => {
			res.setOption('code', '5.00').end()
			res.end()
		})

		// When I do the request
		// Then I should receive an error
		try {
			const params: handshakeParams = {
				agent: new coap.Agent({ type: 'udp4' }),
				objects: '<1/0>, <3/0>, <6/0>',
				deviceName: randomUUID(),
				lifetime: '3600',
				lwm2mV: '1.1',
				port: 5683,
				host: 'localhost',
				biding: 'U',
			}
			await handshake(params)
			throw new Error("didn't throw")
		} catch (error) {
			expect((error as Error).message).toMatch(
				/Server does not accept the request/,
			)
		}
	})
})
