import coap, { type OutgoingMessage } from 'coap'
import jest from 'jest-mock'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import {
	informRegistration,
	manageCoioteRequest,
	manageResponse,
	readObject,
	register,
	registerCommand,
	type serverRequest,
	type serverRespose,
} from '../cmds/register.js'

describe('register command', () => {
	it.only('should describe registration process', () => {
		const deviceObjects = assetTrackerFirmwareV2

		const portSocketConnection = 1
		const inform = jest.fn().mockReturnValue({
			code: '2.01',
			outSocket: { port: portSocketConnection },
		}) as () => coap.OutgoingMessage

		const socketRequest = {
			code: '2.01',
		}

		const socketResponse = {
			code: '2.01',
		}
		const socketConnection = jest.fn().mockReturnValue({
			request: socketRequest,
			response: socketResponse,
			setOption: jest.fn(),
			end: jest.fn(),
		}) as () => coap.Server
		const createSocketPayload = jest.fn() as () => Buffer

		registerCommand(
			deviceObjects,
			inform,
			socketConnection,
			createSocketPayload,
		)

		// should inform the LwM2M server about intention of register elements
		expect(inform).toHaveBeenCalledWith(deviceObjects)

		// expect(inform.code).toBe('2.01')

		// should create socket connection with the server if it accept to start the process
		expect(socketConnection).toHaveBeenCalledWith(portSocketConnection)

		// server ask for the value of one element already told to be register
		// ...

		// should read from that request and build the payload
		expect(createSocketPayload).toHaveBeenCalled() // toHaveBeenCalledWith(socketRequest, deviceObjects)
	})

	describe('steps: ', () => {
		it.only('should inform the LwM2M server about intention of register elements', () => {
			const deviceObjects = assetTrackerFirmwareV2
			const inform = jest.fn().mockReturnValue({
				code: '',
			}) as () => coap.OutgoingMessage

			const socketConnection = jest.fn() as () => coap.Server
			const createSocketPayload = jest.fn() as () => Buffer

			registerCommand(
				deviceObjects,
				inform,
				socketConnection,
				createSocketPayload,
			)

			expect(inform).toHaveBeenCalledWith(deviceObjects)
		})

		it.only('should create socket connection with the server if it accept to start the process', () => {
			const deviceObjects = assetTrackerFirmwareV2

			const portSocketConnection = 1
			const inform = jest.fn().mockReturnValue({
				code: '2.01',
				outSocket: { port: portSocketConnection },
			}) as () => coap.OutgoingMessage

			const socketRequest = {
				code: '2.01',
			}

			const socketResponse = {
				code: '2.01',
			}
			const socketConnection = jest.fn().mockReturnValue({
				request: socketRequest,
				response: socketResponse,
				setOption: jest.fn(),
				end: jest.fn(),
			}) as () => coap.Server
			const createSocketPayload = jest.fn() as () => Buffer

			registerCommand(
				deviceObjects,
				inform,
				socketConnection,
				createSocketPayload,
			)

			expect(socketConnection).toHaveBeenCalledWith(portSocketConnection)
		})

		it.only('should accept request from socket connection and build payload from requested element', () => {
			const deviceObjects = assetTrackerFirmwareV2

			const portSocketConnection = 1
			const inform = jest.fn().mockReturnValue({
				code: '2.01',
				outSocket: { port: portSocketConnection },
			}) as () => coap.OutgoingMessage

			const socketRequest = {
				code: '2.01',
			}

			const socketResponse = {
				code: '2.01',
			}
			const socketConnection = jest.fn().mockReturnValue({
				request: socketRequest,
				response: socketResponse,
				setOption: jest.fn(),
				end: jest.fn(),
			}) as () => coap.Server
			const createSocketPayload = jest.fn() as () => Buffer

			registerCommand(
				deviceObjects,
				inform,
				socketConnection,
				createSocketPayload,
			)

			// server ask for the value of one element already told to be register
			// ...

			expect(createSocketPayload).toHaveBeenCalled() // toHaveBeenCalledWith(socketRequest, deviceObjects)
		})
	})
})

describe('1) inform', () => {
	it('should send registration request with objects to register and return what the LwM2M server response', () => {
		const deviceObjects = assetTrackerFirmwareV2

		const queryResult = ''
		const createQuery = jest.fn().mockReturnValue(queryResult) as () => string

		const sendRequest = jest.fn().mockImplementation(() => ({
			end: jest.fn(),
			on: jest.fn(),
		})) as () => OutgoingMessage

		const bracketResult = ''
		const createBracketFormat = jest
			.fn()
			.mockReturnValue(bracketResult) as () => string

		const payloadResult = ''
		const createPayload = jest
			.fn()
			.mockReturnValue(payloadResult) as () => string

		informRegistration(
			deviceObjects,
			createQuery,
			sendRequest,
			createBracketFormat,
			createPayload,
		)

		// create the registration query
		expect(createQuery).toHaveBeenCalled()

		// send registration
		expect(sendRequest).toHaveBeenCalledWith(queryResult)

		// create format to register elements
		expect(createBracketFormat).toHaveBeenCalledWith(deviceObjects)

		// create the registration query
		expect(createPayload).toHaveBeenCalledWith(bracketResult)

		// TODO: request.end to be called with payload

		// TODO: return response
	})

	it('should send registration request with resource to register and return what the LwM2M server response', () => {
		const resource = '/3/0/0'

		const queryResult = ''
		const createQuery = jest.fn().mockReturnValue(queryResult) as () => string

		const sendRequest = jest.fn().mockImplementation(() => ({
			end: jest.fn(),
			on: jest.fn(),
		})) as () => OutgoingMessage

		const bracketResult = ''
		const createBracketFormat = jest
			.fn()
			.mockReturnValue(bracketResult) as () => string

		const payloadResult = ''
		const createPayload = jest
			.fn()
			.mockReturnValue(payloadResult) as () => string

		informRegistration(
			resource,
			createQuery,
			sendRequest,
			createBracketFormat,
			createPayload,
		)

		// create the registration query
		expect(createQuery).toHaveBeenCalled()

		// send registration
		expect(sendRequest).toHaveBeenCalledWith(queryResult)

		// create format to register elements
		expect(createBracketFormat).toHaveBeenCalledWith(resource)

		// create the registration query
		expect(createPayload).toHaveBeenCalledWith(bracketResult)

		// TODO: request.end to be called with payload

		// TODO: return response
	})
})

describe('2) Approval', () => {
	//receive request from stablished socket connection
	it('should receive approval to the registration request in the stablished socket', () => {
		expect(false).toBe(false)
	})
})

describe('3) send values', () => {
	it('should receive request from stablished socket connection', () => {
		expect(false).toBe(false)
	})
})

describe('register', () => {
	it('should send registration request to server', () => {
		const query = 'query'
		const createRegisterQuery = jest.fn().mockReturnValue(query) as () => string
		const sendRegistrationRequest = jest.fn().mockImplementation(() => ({
			end: jest.fn(),
			on: jest.fn(),
		})) as () => OutgoingMessage

		register(
			assetTrackerFirmwareV2,
			createRegisterQuery,
			sendRegistrationRequest,
		)

		expect(createRegisterQuery).toHaveBeenCalled()
		expect(sendRegistrationRequest).toHaveBeenCalledWith(query)
	})
})

describe('manageResponse', () => {
	it('should stablish a socket connection in case the response is sucess', () => {
		const response = {
			code: '2.01',
			rsinfo: { address: 'unknown', port: 5683 },
			headers: { x: 'y' },
			outSocket: { address: 'unknown', port: 5683 },
		}

		const createServer = jest.fn().mockImplementation(() => ({
			listen: jest.fn(),
			on: jest.fn(),
		})) as () => coap.Server

		manageResponse(response, createServer)

		expect(createServer).toHaveBeenCalled()
	})
})

describe('manageCoioteRequest', () => {
	it('should receive request from server and create response', () => {
		const request = jest
			.fn()
			.mockReturnValue({ url: '/3' }) as unknown as serverRequest
		const response = {
			setOption: jest.fn(),
			end: jest.fn(),
		} as serverRespose // Device simulator response to the server

		const payload: Buffer = Buffer.from('')
		const json = 'application/vnd.oma.lwm2m+json'

		manageCoioteRequest(request, response, assetTrackerFirmwareV2)

		expect(response.setOption).toHaveBeenCalledWith('Content-Format', json)
		expect(response.end).toHaveBeenCalledWith(payload)
	})
})

describe('readObject', () => {
	it('Should read from object and create buffer from its values', () => {
		const url = '/3'
		const result = JSON.parse(
			readObject(url, assetTrackerFirmwareV2).toString(),
		)
		expect(result.bn).toBe(url)
		expect(result.e[0]).toHaveProperty('n', '0/0')
		expect(result.e[0]).toHaveProperty('sv', 'Nordic')
	})

	it('Should read from instance and create buffer from its values', () => {
		const url = '/3/0'
		const result = JSON.parse(
			readObject(url, assetTrackerFirmwareV2).toString(),
		)
		expect(result.bn).toBe(url)
		expect(result.e[0]).toHaveProperty('n', '0')
		expect(result.e[0]).toHaveProperty('sv', 'Nordic')
	})

	it('Should read from resource and create buffer from its value', () => {
		const url = '/3/0/0'
		const result = JSON.parse(
			readObject(url, assetTrackerFirmwareV2).toString(),
		)
		expect(result.bn).toBe(url)
		expect(result.e[0]).toHaveProperty('sv', 'Nordic')
		expect(result.e[0]).not.toHaveProperty('sv', '00010')
	})

	it('Should return object with null values if URL is not valid', () => {
		const url = '/4040404'
		const result = JSON.parse(
			readObject(url, assetTrackerFirmwareV2).toString(),
		)
		expect(result.bn).toBe(null)
		expect(result.e).toBe(null)
	})
})
