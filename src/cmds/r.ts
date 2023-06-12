import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import coap from 'coap'
import { type CoapMethod } from 'coap-packet'
import { config } from '../../config'
import type { assetTracker } from '../assetTrackerV2'
import { createResourceList, type e } from '../utils/createResourceList'
import { getBracketFormat } from '../utils/getBracketFormat'
import { getElementPath } from '../utils/getElementPath'
import { getLibUrn } from '../utils/getLibUrn'
import { requestParser, type request } from '../utils/requestParser'
import { typeOfElement } from '../utils/typeOfElement'

const udpDefault = 'udp4'
/**
 * Json as IANA Media Type
 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
 */
const json = 'application/vnd.oma.lwm2m+json'

/**
 * init register request
 * name: initRequest
 */
export const register = (
	deviceObjects: assetTracker,
	deviceName = config.deviceName,
	lifetime = config.lifetime,
	lwm2mVersion = config.lwm2mV,
	biding = config.biding,
	port = config.port,
	host = config.host,
	createBracketFormat = (deviceObjects: assetTracker) =>
		getBracketFormat(deviceObjects),
	sendRegistrationRequest = (params: coap.CoapRequestParams) =>
		registrationRequest(params),
	createSocket = (deviceObjects: assetTracker, response: any) =>
		openSocketConnection(deviceObjects, response),
): void => {
	const query = `ep=${deviceName}&lt=${lifetime}&lwm2m=${lwm2mVersion}&b=${biding}`
	const params = {
		host: host,
		port: port,
		pathname: '/rd',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format': 'application/link-format',
		},
		query: query,
	}

	const registration = sendRegistrationRequest(params)
	const bracketFormat = createBracketFormat(deviceObjects)
	const dataFormatId = '11543'
	const payload = `</>;ct=${dataFormatId};hb,${bracketFormat}`
	registration.end(payload)

	registration.on('error', (err: unknown) => {
		console.log({ err })
	})

	registration.on('response', (response) =>
		createSocket(deviceObjects, response),
	)
}

type response = {
	code: string
	outSocket: {
		port: number
	}
}

/**
 * Open socket connection to transfer the values of the already told LwM2M elements to be implemented
 */
export const openSocketConnection = (
	deviceObjects: assetTracker,
	response: response,
	createSocket = () =>
		coap.createServer({
			type: udpDefault,
			proxy: true,
		}),
	send = (deviceObjects: assetTracker, request: any, response: any) =>
		sendValues(deviceObjects, request, response),
): void => {
	if (response.code === '2.01') {
		const port = response.outSocket.port
		const socket = createSocket()

		socket.listen(port, (err: unknown) => {
			console.log({ err })
		})

		socket.on('request', (request, response) =>
			send(deviceObjects, request, response),
		)
	}
}

/**
 * send the values of the LwM2M element in the expected format
 */
export const sendValues = (
	deviceObjects: assetTracker,
	request: coap.IncomingMessage,
	response: coap.OutgoingMessage,
	parseRequest = (request: request) => requestParser(request),
	read = (url: string, deviceObjects: assetTracker) =>
		readObject(url, deviceObjects),
): void => {
	const action = parseRequest(request as any)

	let result: Buffer = Buffer.from('')
	switch (action) {
		case 'read':
			result = read(request.url, deviceObjects)
			break
	}

	response.setOption('Content-Format', json)
	response.end(result)
}

export const registrationRequest = (
	params: coap.CoapRequestParams,
): coap.OutgoingMessage => {
	const agent = new coap.Agent({ type: udpDefault })
	return agent.request(params)
}

type lwm2mJson = {
	bn: string
	e: e[]
}

/**
 * Read value from requested URL and transform it to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const readObject = (url: string, objectList: assetTracker): Buffer => {
	const elementPath = getElementPath(url)
	const urn = getLibUrn(`${elementPath.objectId}`)

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
