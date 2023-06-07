import coap, { type OutgoingMessage } from 'coap'
import jest from 'jest-mock'
import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import {
	manageCoioteRequest,
	manageResponse,
	readObject,
	register,
	type serverRequest,
	type serverRespose,
} from '../cmds/register.js'

describe('register command', () => {
	it.only('should  1) inform the LwM2M server which objects whant to register, 2) receive approval from server and 3) send values', () => {
		expect(true).toBe(true)
	})
})

describe('1) inform', () => {
	it.only('should send registration request with objects to register and return what the LwM2M server response', () => {
		// const deviceObjects = assetTrackerFirmwareV2

		// register(deviceObjects,)

		// getObjectsToRegister in bracket format

		// create the registration query

		// send the registration request

		// get response from coiote and stablish socket connection

		// send objects value

		expect(true).toBe(true)
	})

	it.only('should send registration request with resource to register and return what the LwM2M server response', () => {
		expect(true).toBe(true)
	})
})

describe('2) Approval', () => {
	//receive request from stablished socket connection
	it.only('should receive approval to the registration request in the stablished socket', () => {
		expect(false).toBe(false)
	})
})

describe('3) send values', () => {
	it.only('should receive request from stablished socket connection', () => {
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
