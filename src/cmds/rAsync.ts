import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import coap, { IncomingMessage } from 'coap'
import { type CoapMethod } from 'coap-packet'
import { config } from '../../config'
import type { assetTracker } from '../assetTrackerV2'
import { createResourceList } from '../utils/createResourceList'
import { getBracketFormat } from '../utils/getBracketFormat'
import { getElementPath } from '../utils/getElementPath'
import { getLibUrn } from '../utils/getLibUrn'
import { requestParser } from '../utils/requestParser'
import { typeOfElement } from '../utils/typeOfElement'
import type { lwm2mJson } from './register'

const udpDefault = 'udp4'
/**
 * Json as IANA Media Type
 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
 */
const json = 'application/vnd.oma.lwm2m+json'

/**
 *
 */
export const main = async (deviceObjects: assetTracker) => {
	console.log('\n... Init registration')
	const bracketFormat = getBracketFormat(deviceObjects)
	const initialHandShake = await handShake(bracketFormat)
	//console.log(initialHandShake)

	if (initialHandShake.code === '2.01') {
		console.log('\nHand shake has been approved')
		const port = initialHandShake.outSocket?.port
		if (port === undefined) return 'error'

		const socketConnection = await createSocketConnection(port, deviceObjects)
        console.log(socketConnection)

        /*
        const action = requestParser(socketConnection.request)
		const url = socketConnection.request.url
		console.log(`\nLwM2M server is requesting to ${action} from ${url}`)
        let result: Buffer = Buffer.from('')
		if (action === 'read') {
			result = createResponse(url, deviceObjects)
		}
        socketConnection.response.setOption('Content-Format', json)
		socketConnection.response.end(result)
        */
	}
}

export const handShake = (bracketFormat: string): Promise<IncomingMessage> => {
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

	const dataFormatId = '11543'
	const payload = `</>;ct=${dataFormatId};hb,${bracketFormat}`

	const agent = new coap.Agent({ type: udpDefault })
	const request = agent.request(params)

	request.end(payload)

	request.on('error', (err: unknown) => {
		console.log({ err })
	})

	return new Promise((resolve, reject) => {
		const t = setTimeout(reject, 10 * 1000)

		request.on('response', (response) => {
			clearTimeout(t)
			if (response.code === '2.01') {
				return resolve(response)
			}
			return reject(new Error('Server does not accept the request'))
		})
	})
}

export const createSocketConnection = (
	port: number,
	deviceObjects: assetTracker,
	createSocket = () =>
		coap.createServer({
			type: udpDefault,
			proxy: true,
		}),
): Promise<any> | any => {
    console.log('here')
	const socket = createSocket()

	socket.listen(port, (err: unknown) => {
		console.log(
			`Socket connection stablished. Listening from port number: ${port}`,
		)
		if (err !== undefined) console.log({ err })
	})

    /*
    return new Promise((resolve, reject) => {
		const t = setTimeout(reject, 10 * 1000)

		socket.on('request', (request, response) => {
			clearTimeout(t)
			return resolve({request, response})
		})
	})
    */

    /* */
	socket.on('request', (request, response) => {
		const action = requestParser(request)
		const url = request.url
		console.log(`\nLwM2M server is requesting to ${action} from ${url}`)
        let result: Buffer = Buffer.from('')
		if (action === 'read') {
			result = createResponse(url, deviceObjects)
		}
        response.setOption('Content-Format', json)
		response.end(result)
	})
    
}

/**
 * Read value from requested URL and transform it to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const createResponse = (
	url: string,
	objectList: assetTracker,
): Buffer => {
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
