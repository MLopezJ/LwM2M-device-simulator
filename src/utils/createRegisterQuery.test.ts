import 'dotenv/config'
import { createRegisterQuery } from './createRegisterQuery'

describe('createRegisterQuery', () => {
	it('should build register query with .env values', () => {
		expect(createRegisterQuery()).toStrictEqual(
			'ep=urn:imei:000000000000005&lt=3600&lwm2m=1.1&b=U',
		)
	})
	it('should build register query', () => {
		expect(createRegisterQuery('test', 60, 1.0, 'U')).toStrictEqual(
			'ep=test&lt=60&lwm2m=1&b=U',
		)
	})
})
