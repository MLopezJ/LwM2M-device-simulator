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
 * outside in register command
 */
export const register = (
	deviceObjects: assetTracker,
	getParams = () => createInitParams(),
	getPayload = (deviceObjects: assetTracker) =>
		createInitPayload(deviceObjects),
	sendRegistrationRequest = (params: coap.CoapRequestParams) =>
		registrationRequest(params),
	createSocket = () =>
		coap.createServer({
			type: udpDefault,
			proxy: true,
		}),
	parseRequest = (request: request) => requestParser(request),
	read = (url: string, deviceObjects: assetTracker) => readObject(url,deviceObjects)
): void => {
	const params = getParams()
	const registration = sendRegistrationRequest(params)

	const payload = getPayload(deviceObjects)
	registration.end(payload)

	registration.on('error', (err: unknown) => {
		console.log({ err })
	})

	registration.on('response', (response) => {
		if (response.code === '2.01') {
			const port = response.outSocket.port
			const socket = createSocket()

			socket.listen(port, (err: unknown) => {
				console.log({ err })
			})

			socket.on('request', (request, response) => {
				const action = parseRequest(request)

				let result: Buffer = Buffer.from('')
				switch (action) {
					case 'read':
						result = read(request.url, deviceObjects)
						break
				}

				response.setOption('Content-Format', json)
				response.end(result)
			})
		}
	})
}

/**
 *
 */
const createInitParams = () => {
	const query = `ep=${config.deviceName}&lt=${config.lifetime}&lwm2m=${config.lwm2mV}&b=${config.biding}`
	const params = {
		host: config.host,
		port: config.port,
		pathname: '/rd',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format': 'application/link-format',
		},
		query: query,
	}
	return params
}

/**
 *
 */
const createInitPayload = (
	deviceObjects: assetTracker,
	createBracketFormat = (objects: assetTracker | string) =>
		getBracketFormat(objects),
) => {
	const bracketFormat = createBracketFormat(deviceObjects)
	const dataFormatId = '11543'
	const payload = `</>;ct=${dataFormatId};hb,${bracketFormat}`
	return payload
}

export const registrationRequest = (params: coap.CoapRequestParams) => {
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
