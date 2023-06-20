import { getURN, type LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import coap, { IncomingMessage } from 'coap'
import { type CoapMethod } from 'coap-packet'
import type { assetTracker } from '../assetTrackerV2'
import { createResourceList } from '../utils/createResourceList'
import { getBracketFormat } from '../utils/getBracketFormat'
import { getElementPath } from '../utils/getElementPath'
import { isObjectInAssetTracker } from '../utils/isObjectInAssetTracker'
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
 * Request to register the device objects in a LwM2M server
 */
export const main = async (
	deviceObjects: assetTracker,
): Promise<void | 'error'> => {
	const bracketFormat = getBracketFormat(deviceObjects)
	const initialHandShake = await handShake(bracketFormat)

	if (initialHandShake.code !== '2.01')
		return new Promise((resolve, reject) =>
			reject(new Error('Initial hand shake is not accepted')),
		)

	const socketPort = initialHandShake.outSocket?.port

	if (socketPort === undefined) {
		console.log('Socket connection is not stablish')
		return 'error'
	}

	const socket = createSocket()

	socket.listen(socketPort, (err: unknown) => {
		console.log(
			`Socket connection stablished. Listening from port number: ${socketPort}`,
		)
		if (err !== undefined) console.log({ err })
	})

	socket.on('request', async (request, response) => {
		const action = requestParser(request)
		const url = request.url

		console.log(`\nLwM2M server is requesting to ${action} from ${url}`)

		let result: Buffer = Buffer.from('')

		if (action === 'read') {
			result = await readObjectValue(url, deviceObjects)
		}

		response.setOption('Content-Format', json)
		response.end(result)
	})

	return new Promise((resolve) => resolve)
}

/**
 * Send hand shake request to LwM2M server
 */
export const handShake = async (
	bracketFormat: string,
): Promise<IncomingMessage> => {
	const deviceName = process.env.deviceName ?? ''
	const lifetime =
		process.env.lifetime !== undefined ? Number(process.env.lifetime) : 0
	const lwm2mV =
		process.env.lwm2mV !== undefined ? Number(process.env.lwm2mV) : 0.0
	const biding = process.env.biding ?? ''
	const query = `ep=${deviceName}&lt=${lifetime}&lwm2m=${lwm2mV}&b=${biding}`
	const port = process.env.port !== undefined ? Number(process.env.port) : 0
	const host = process.env.host ?? ''
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

/**
 * Create a coap server
 */
const createSocket = () =>
	coap.createServer({
		type: udpDefault,
		proxy: true,
	})

/**
 * Read value from requested URL and transform it to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const readObjectValue = async (
	url: string,
	objectList: assetTracker,
): Promise<Buffer> => {
	const elementPath = getElementPath(url)
	let urn = await getURN(`${elementPath.objectId}`)

	if (urn === undefined) {
		if (isObjectInAssetTracker(`${elementPath.objectId}`) === false)
			return Buffer.from(JSON.stringify({ bn: null, e: null }))

		// * if urn is not found in LwM2M-types lib but object id is part of Asset Tracker, it means the object is a custom object of Asset Tracker v2
		urn = `${elementPath.objectId}`
	}

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
