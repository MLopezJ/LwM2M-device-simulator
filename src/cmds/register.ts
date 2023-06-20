import { getURN, type LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import coap, { OutgoingMessage } from 'coap' // type Agent,
import { type assetTracker } from '../assetTrackerV2.js'
import { createParamsRequest } from '../utils/createParamsRequest.js'
import { createRegisterQuery } from '../utils/createRegisterQuery.js'
import { createResourceList, type e } from '../utils/createResourceList.js'
import { getBracketFormat } from '../utils/getBracketFormat.js'
import { getElementPath } from '../utils/getElementPath.js'
import { requestParser, type request } from '../utils/requestParser.js'
import { typeOfElement } from '../utils/typeOfElement.js'

type registrationResponse = {
	code: string
	rsinfo: { address: unknown; port: unknown }
	headers: { [x: string]: string }
	outSocket: { address: unknown; port: string | number }
}

const udpDefault = 'udp4'
let assetTrackerObjects: undefined | assetTracker = undefined
/**
 * Json as IANA Media Type
 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
 */
const json = 'application/vnd.oma.lwm2m+json'

// new ---
export const registerCommand = (
	deviceObjects: assetTracker,
	inform = (deviceObjects: assetTracker) => informRegistration(deviceObjects),
	socketConnection = (port: number) => stablishSocketConnection(port),
	createPayload = (
		request: coap.OutgoingMessage,
		deviceObjects: assetTracker,
	) => createSocketPayload(request, deviceObjects),
): void => {
	// inform server about desire of registration
	const registration = inform(deviceObjects)

	// create socket connection if server approve the registration of values
	if (registration.code === '2.01') {
		const port = (registration as any).outSocket.port // TODO: solve this

		// stablish a socket connection
		const connection = socketConnection(port) as unknown as coap.OutgoingMessage

		const payload = createPayload(
			connection._request as unknown as OutgoingMessage, // TODO: solve this
			deviceObjects,
		)

		connection.setOption('Content-Format', json)
		connection.end(payload)
	}
}

/**
 * Build a request to registry LwM2M elements in a LwM2M server
 */
export const informRegistration = (
	objectList: assetTracker | string,
	createQuery = () => createRegisterQuery(),
	sendRequest = (query: string) => sendRegistrationRequest(query),
	createBracketFormat = (objects: assetTracker | string) =>
		getBracketFormat(objects),
	createPayload = (objects: string) => getPayload(objects),
): coap.OutgoingMessage => {
	const query = createQuery()

	const request = sendRequest(query)

	const objects = createBracketFormat(objectList)

	const payload = createPayload(objects)

	request.end(payload)

	request.on('error', (err: unknown) => {
		console.log({ err })
	})

	const response = request.on('response', (response) => response)

	return response
}

/**
 * Create a server listening the port given by params
 */
const stablishSocketConnection = (
	port: number,
	createServer = () =>
		coap.createServer({
			type: udpDefault,
			proxy: true,
		}),
): coap.Server => {
	// Create a new server to interact with Coiote
	const server = createServer()

	server.listen(port, (err: unknown) => {
		console.log({ err })
	})

	return server.on(
		'request',
		(request: serverRequest, response: serverRespose) => {
			return { request, response }
		},
	)
}

/**
 *
 */
const createSocketPayload = (
	request: coap.OutgoingMessage,
	objectList: assetTracker,
): Buffer => {
	const actionRequested = requestParser(request as unknown as request)
	let payload: Buffer = Buffer.from('')
	switch (actionRequested) {
		case 'read':
			payload = readObject(request.url as string, objectList) // TODO: test creation of paylod from read request
			break
	}
	return payload
}

// old ---

/**
 * Create the payload to be used in the registration request
 *
 * 11543 is the id for Transferring Resource Information as a json in LwM2M
 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
 */
export const getPayload = (objects: string): string => {
	const dataFormatId = '11543'
	return `</>;ct=${dataFormatId};hb,${objects}`
}

/**
 * Index
 */
export const register = (
	objectList: assetTracker,
	createRegisterQuery: () => string,
	sendRegistrationRequest: (query: string) => OutgoingMessage,
	//createParams: () => CoapRequestParams
): void => {
	assetTrackerObjects = objectList
	/**
	 * Data Format id for Transferring Resource Information as a json
	 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
	 */
	const dataFormatId = '11543'
	const objects = getBracketFormat(objectList)
	const payload = `</>;ct=${dataFormatId};hb,${objects}`
	const query = createRegisterQuery()

	const registerRequest = sendRegistrationRequest(query)

	registerRequest.end(payload)

	registerRequest.on('error', (err: unknown) => {
		console.log({ err })
	})

	registerRequest.on('response', (response: registrationResponse) =>
		manageResponse(response),
	)
}

/**
 * Send registration request to server
 */
export const sendRegistrationRequest = (
	query: string,
): coap.OutgoingMessage => {
	const params = createParamsRequest(query)
	const agent = new coap.Agent({ type: udpDefault })
	const registerRequest = agent.request(params)

	return registerRequest
}

export type serverRequest = { url: string }
export type serverRespose = {
	setOption: (arg0: string, arg1: string) => void
	end: (arg0: string | Buffer | undefined) => void
}

/**
 * Create a socket connection between LwM2M client and LwM2M server
 *
 * stablishSocketConnection
 */
export const manageResponse = (
	response: registrationResponse,
	createServer = () =>
		coap.createServer({
			type: udpDefault,
			proxy: true,
		}),
): void => {
	// if registration sucess
	if (response.code === '2.01') {
		const socketPort = response.outSocket.port // socket port of connection between Coiote and Device Simulator

		// Create a new server to interact with Coiote
		const server = createServer()

		server.listen(socketPort as number, (err: unknown) => {
			console.log({ err })
		})

		server.on('request', (request: serverRequest, response: serverRespose) =>
			manageCoioteRequest(request, response),
		)
	}
}

/**
 * Identify the action requested and create payload to response
 *
 * sendResponse
 */
export const manageCoioteRequest = (
	request: serverRequest,
	response: serverRespose,
	objectList: assetTracker | undefined = assetTrackerObjects,
): void => {
	const actionRequested = requestParser(request as request)
	console.log('Coiote request ', actionRequested, ' element ', request.url)

	let payload: Buffer = Buffer.from('')
	if (objectList !== undefined) {
		switch (actionRequested) {
			case 'read':
				payload = readObject(request.url, objectList) // TODO: test creation of paylod from read request
				break
		}
	} else {
		console.log('List with objects is undefined')
	}

	/**
	 * Json as IANA Media Type
	 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
	 */
	const json = 'application/vnd.oma.lwm2m+json'

	response.setOption('Content-Format', json)
	response.end(payload)
}

export type lwm2mJson = {
	bn: string
	e: e[]
}

/**
 * Read value from requested URL and transform it to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const readObject = (url: string, objectList: assetTracker): Buffer => {
	const elementPath = getElementPath(url)
	const urn = getURN(`${elementPath.objectId}`)

	// element not found in object list
	if (Boolean(urn) === false)
		return Buffer.from(JSON.stringify({ bn: null, e: null }))

	const object = objectList[`${urn}` as keyof LwM2MDocument]
	const elementType = typeOfElement(url)

	const data: lwm2mJson = {
		bn: url,
		e:
			elementType !== undefined
				? createResourceList(object ?? {}, elementType, elementPath)
				: [],
	}

	return Buffer.from(JSON.stringify(data))
}
