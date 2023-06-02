import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import coap, { OutgoingMessage, type CoapRequestParams } from 'coap' // type Agent,
import { config } from '../../config.js'
import { type assetTracker } from '../assetTrackerV2.js'
import { createE, type e } from '../utils/createE.js'
import { getBracketFormat } from '../utils/getBracketFormat.js'
import { getElementPath } from '../utils/getElementPath.js'
import { getLibUrn } from '../utils/getLibUrn.js'
import { getRegisterQuery } from '../utils/getRegisterQuery.js'
import { requestParser } from '../utils/requestParser.js'
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
 * Index
 */
export const register = (objectList: assetTracker): void => {
	assetTrackerObjects = objectList
	/**
	 * Data Format id for Transferring Resource Information as a json
	 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
	 */
	const dataFormatId = '11543'
	const objects = getBracketFormat(objectList)
	const payload = `</>;ct=${dataFormatId};hb,${objects}`

	const registerRequest = registration()

	registerRequest.end(payload)

	registerRequest.on('error', (err: any) => {
		console.log({ err })
	})

	registerRequest.on('response', (response: registrationResponse) =>
		manageResponse(response),
	)
}

/**
 * Send registration request to server
 */
const registration = (): OutgoingMessage => {
	const params: CoapRequestParams = {
		host: config.host,
		port: config.port,
		pathname: '/rd',
		method: 'POST',
		options: { 'Content-Format': 'application/link-format' },
		query: getRegisterQuery(),
	}

	const agent = new coap.Agent({ type: udpDefault })
	const registerRequest = agent.request(params)

	return registerRequest
}

type serverRequest = { url: string }
type serverRespose = {
	setOption: (arg0: string, arg1: string) => void
	end: (arg0: string | Buffer | undefined) => void
}

/**
 * Stablish a socket connection in case the response is sucess
 */
const manageResponse = (response: registrationResponse) => {
	// if registration sucess
	if (response.code === '2.01') {
		const socketPort = response.outSocket.port // socket port of connection between Coiote and Device Simulator

		// Create a new server to interact with Coiote
		const server = coap.createServer({
			type: udpDefault,
			proxy: true,
		})

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
 */
const manageCoioteRequest = (
	request: serverRequest,
	response: serverRespose,
	objectList: assetTracker | undefined = assetTrackerObjects,
) => {
	const actionRequested = requestParser(request as any) // TODO: improve this
	console.log('Coiote request ', actionRequested, ' element ', request.url)

	let payload: Buffer = Buffer.from('')
	if (objectList !== undefined) {
		switch (actionRequested) {
			case 'read':
				payload = readObject(request.url, objectList)
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
				? createE(object ?? {}, elementType, elementPath)
				: [],
	}

	return Buffer.from(JSON.stringify(data))
}
