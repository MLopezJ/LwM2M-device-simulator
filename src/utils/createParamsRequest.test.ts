import 'dotenv/config'
import { createParamsRequest } from './createParamsRequest.js'

describe('createParamsRequest', () => {
	it('should build register query with config values', () => {
		const query = 'ep=test&lt=60&lwm2m=1&b=U'
		const result = createParamsRequest(query)
		expect(result.query).toBe(query)
		expect(result.host).toBe('eu.iot.avsystem.cloud')
		expect(result.port).toBe(5683)
		expect(result.pathname).toBe('/rd')
		expect(result.method).toBe('POST')
		expect(result.options ?? ['Content-Format']).toMatchObject({
			'Content-Format': 'application/link-format',
		})
	})

	it('should build register query', () => {
		const query = 'ep=test&lt=60&lwm2m=1&b=U'
		const localHost = 'localhost'
		const port = 1234
		const pathname = '/pathname'
		const method = 'GET'
		const options = { 'Content-Format': 'application/link-format' }
		const result = createParamsRequest(
			query,
			localHost,
			port,
			pathname,
			method,
			options,
		)

		expect(result.query).toBe(query)
		expect(result.host).toBe(localHost)
		expect(result.port).toBe(port)
		expect(result.pathname).toBe(pathname)
		expect(result.method).toBe(method)
		expect(result.options ?? ['Content-Format']).toMatchObject({
			'Content-Format': 'application/link-format',
		})
	})
})
