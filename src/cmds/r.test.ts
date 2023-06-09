import coap, { OutgoingMessage } from 'coap'
import jest from 'jest-mock'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2'
import { register } from './r'

describe('register', () => {
	it('should get the parameters to init the registration request', () => {
		const deviceObjects = assetTrackerFirmwareV2
		const getParams = jest.fn().mockReturnValue({
			host: 'host',
			port: 1234,
			pathname: '/rd',
			method: 'POST',
			options: {
				'Content-Format': 'application/link-format',
			},
			query: 'ep=deviceName&lt=60&lwm2m=1.1&b=U',
		}) as () => coap.CoapRequestParams

		register(deviceObjects, getParams)

		expect(getParams).toBeCalled()
	})

	it('should call function to tranform objects to register into expected bracket format', () => {
		const deviceObjects = assetTrackerFirmwareV2
		const getParams = jest.fn().mockReturnValue({
			host: 'host',
			port: 1234,
			pathname: '/rd',
			method: 'POST',
			options: {
				'Content-Format': 'application/link-format',
			},
			query: 'ep=deviceName&lt=60&lwm2m=1.1&b=U',
		}) as () => coap.CoapRequestParams
		const getPayload = jest
			.fn()
			.mockReturnValue(
				'<6/0>, <10256/0>, <50009/0>, <1/0>, <3/0>, <4/0>, <5/0>, <3303/0>, <3304/0>, <3323/0>, <3347/0>',
			) as () => string

		register(deviceObjects, getParams, getPayload)

		expect(getPayload).toBeCalledWith(deviceObjects)
	})

	it('should send registration request to LwM2M server', () => {
		const deviceObjects = assetTrackerFirmwareV2
		const params: coap.CoapRequestParams = {
			host: 'host',
			port: 1234,
			pathname: '/rd',
			method: 'POST',
			options: {
				'Content-Format': 'application/link-format',
			},
			query: 'ep=deviceName&lt=60&lwm2m=1.1&b=U',
		}
		const getParams = jest
			.fn()
			.mockReturnValue(params) as () => coap.CoapRequestParams
		const getPayload = jest
			.fn()
			.mockReturnValue(
				'<6/0>, <10256/0>, <50009/0>, <1/0>, <3/0>, <4/0>, <5/0>, <3303/0>, <3304/0>, <3323/0>, <3347/0>',
			) as () => string
		const sendRegistrationRequest = jest.fn().mockImplementation(() => ({
			end: jest.fn(),
			on: jest.fn(),
		})) as () => OutgoingMessage

		register(deviceObjects, getParams, getPayload, sendRegistrationRequest)

		expect(sendRegistrationRequest).toBeCalledWith(params)
	})

	it('should send registration request with payload to LwM2M server', () => {
		const deviceObjects = assetTrackerFirmwareV2
		const params: coap.CoapRequestParams = {
			host: 'host',
			port: 1234,
			pathname: '/rd',
			method: 'POST',
			options: {
				'Content-Format': 'application/link-format',
			},
			query: 'ep=deviceName&lt=60&lwm2m=1.1&b=U',
		}
		const getParams = jest
			.fn()
			.mockReturnValue(params) as () => coap.CoapRequestParams
		const getPayloadResult =
			'<6/0>, <10256/0>, <50009/0>, <1/0>, <3/0>, <4/0>, <5/0>, <3303/0>, <3304/0>, <3323/0>, <3347/0>'
		const getPayload = jest
			.fn()
			.mockReturnValue(getPayloadResult) as () => string

		const sendRegistrationRequestEnd = jest.fn()
		const sendRegistrationRequest = jest.fn().mockImplementation(() => ({
			end: sendRegistrationRequestEnd,
			on: jest.fn(),
		})) as () => OutgoingMessage

		register(deviceObjects, getParams, getPayload, sendRegistrationRequest)

		expect(sendRegistrationRequest).toBeCalledWith(params)
		expect(sendRegistrationRequestEnd).toBeCalledWith(getPayloadResult)
	})
})
