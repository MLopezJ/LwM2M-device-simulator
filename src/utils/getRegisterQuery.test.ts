import { getRegisterQuery } from './getRegisterQuery'

describe('getRegisterQuery', () => {
	it('should build register query with config values', () => {
		expect(getRegisterQuery()).toStrictEqual(
			'ep=urn:imei:000000000000005&lt=3600&lwm2m=1.1&b=U',
		)
	})
	it('should build register query', () => {
		expect(getRegisterQuery('test', 60, 1.0, 'U')).toStrictEqual(
			'ep=test&lt=60&lwm2m=1&b=U',
		)
	})
})
