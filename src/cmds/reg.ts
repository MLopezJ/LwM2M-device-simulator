import { getURN, type LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import coap from 'coap'
import type { assetTracker } from '../assetTrackerV2'
import { createResourceList } from '../utils/createResourceList'
import { getBracketFormat } from '../utils/getBracketFormat'
import { getElementPath } from '../utils/getElementPath'
import { isObjectInAssetTracker } from '../utils/isObjectInAssetTracker'
import { requestParser } from '../utils/requestParser'
import { typeOfElement } from '../utils/typeOfElement'
import { handshake } from './handshake'
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
export const registerDeviceObjects = async (
	deviceObjects: assetTracker,
): Promise<void | 'error'> => {
	const agent = new coap.Agent({ type: 'udp4' })
	const objects = getBracketFormat(deviceObjects)
	const { socketPort } = await handshake({
		agent,
		objects,
		deviceName: undefined,
		lifetime: undefined,
		biding: undefined,
		port: undefined,
		host: undefined,
		lwm2mV: undefined,
	})

	return new Promise((resolve, reject) => {
		const socket = createSocket()

		socket.listen(socketPort, (err: unknown) => {
			console.log(
				`Socket connection stablished. Listening from port number: ${socketPort}`,
			)
			if (err !== undefined) reject(err)
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

			resolve()
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
