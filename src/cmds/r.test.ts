import coap, { OutgoingMessage } from 'coap'
import jest from 'jest-mock'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2'
import { openSocketConnection, register, sendValues } from './r'

/*

*/
describe('register command', () => {
	describe('should describe registration process', () => {
		describe('init register request', () => {
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

				const getPayload = jest.fn() as () => string

				const sendRegistrationRequest = jest.fn().mockImplementation(() => ({
					end: jest.fn(),
					on: jest.fn(),
				})) as () => OutgoingMessage

				register(deviceObjects, getParams, getPayload, sendRegistrationRequest)

				expect(getParams).toBeCalled()
			})

			it('should call function to tranform objects into expected bracket format', () => {
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

				const sendRegistrationRequest = jest.fn().mockImplementation(() => ({
					end: jest.fn(),
					on: jest.fn(),
				})) as () => OutgoingMessage

				register(deviceObjects, getParams, getPayload, sendRegistrationRequest)

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

			it('should call method to create socket connection with server', () => {
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

				const registrationOn = jest.fn()

				const sendRegistrationRequest = jest.fn().mockImplementation(() => ({
					end: jest.fn(),
					on: registrationOn,
				})) as () => OutgoingMessage

				const createSocket = jest.fn().mockImplementation(() => ({
					listen: jest.fn(),
					on: jest.fn(),
				})) as () => coap.Server

				register(
					deviceObjects,
					getParams,
					getPayload,
					sendRegistrationRequest,
					createSocket,
				)

				expect(registrationOn).toBeCalledTimes(2)
			})
		})

		describe('open socket connection', () => {
			it('should open a socket connection if server agree with that', () => {
				const deviceObjects = assetTrackerFirmwareV2
				const response = {
					code: '2.01',
					outSocket: {
						port: 506,
					},
				}
				const createSocket = jest.fn().mockImplementation(() => ({
					listen: jest.fn(),
					on: jest.fn(),
				})) as () => coap.Server
				const sendValues = jest.fn()

				openSocketConnection(deviceObjects, response, createSocket, sendValues)
				expect(createSocket).toBeCalled()
			})

			it('should not open a socket connection if server is not agree with that', () => {
				const deviceObjects = assetTrackerFirmwareV2
				const response = {
					code: '4.04',
					outSocket: {
						port: 506,
					},
				}
				const createSocket = jest.fn() as () => coap.Server
				const sendValues = jest.fn()

				openSocketConnection(deviceObjects, response, createSocket, sendValues)
				expect(createSocket).not.toBeCalled()
			})

			it('should listen from given port', () => {
				const deviceObjects = assetTrackerFirmwareV2
				const response = {
					code: '2.01',
					outSocket: {
						port: 506,
					},
				}
				const listen = jest.fn()
				const anonymousFucntion = expect.any(Function)
				const createSocket = jest.fn().mockImplementation(() => ({
					listen: listen,
					on: jest.fn(),
				})) as () => coap.Server
				const sendValues = jest.fn()

				openSocketConnection(deviceObjects, response, createSocket, sendValues)
				expect(listen).toBeCalledWith(
					response.outSocket.port,
					anonymousFucntion,
				)
			})

			it("should call 'request' listener", () => {
				const deviceObjects = assetTrackerFirmwareV2
				const response = {
					code: '2.01',
					outSocket: {
						port: 506,
					},
				}
				const listen = jest.fn()
				const anonymousFucntion = expect.any(Function)
				const on = jest.fn()
				const createSocket = jest.fn().mockImplementation(() => ({
					listen: listen,
					on: on,
				})) as () => coap.Server
				const sendValues = jest.fn()

				openSocketConnection(deviceObjects, response, createSocket, sendValues)
				expect(on).toBeCalledWith('request', anonymousFucntion)
			})
		})

		describe('send value', () => {
			it('should receive request from socket and parse it to discover which action is requested to be implemented', () => {
				const deviceObjects = assetTrackerFirmwareV2
				const request = {} as coap.IncomingMessage
				const response = {
					setOption: jest.fn(),
					end: jest.fn(),
				} as unknown as coap.OutgoingMessage
				const parseRequest = jest.fn() as () => string
				const read = jest.fn() as () => Buffer

				sendValues(deviceObjects, request, response, parseRequest, read)

				expect(parseRequest).toBeCalledWith(request)
			})

			it('should call method to read value from requested element', () => {
				const deviceObjects = assetTrackerFirmwareV2
				const request = {
					url: '/3',
				} as coap.IncomingMessage
				const response = {
					setOption: jest.fn(),
					end: jest.fn(),
				} as unknown as coap.OutgoingMessage
				const parseRequest = jest.fn().mockReturnValue('read') as () => string
				const read = jest.fn() as () => Buffer

				sendValues(deviceObjects, request, response, parseRequest, read)

				expect(read).toBeCalledWith(request.url, deviceObjects)
			})

			it('should send result to server using the socket connection', () => {
				const deviceObjects = assetTrackerFirmwareV2
				const request = {
					url: '/3',
				} as coap.IncomingMessage
				const setOption = jest.fn()
				const end = jest.fn()
				const response = {
					setOption: setOption,
					end: end,
				} as unknown as coap.OutgoingMessage
				const parseRequest = jest.fn().mockReturnValue('read') as () => string
				const result = Buffer.from('result')
				const read = jest.fn().mockReturnValue(result) as () => Buffer

				sendValues(deviceObjects, request, response, parseRequest, read)

				expect(setOption).toBeCalled()
				expect(end).toBeCalledWith(result)
			})
		})
	})
})
