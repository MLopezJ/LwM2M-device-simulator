import coap from 'coap'
import { type CoapMethod } from 'coap-packet'
import { type assetTracker } from '../assetTrackerV2'
import { checkInstance } from '../utils/checkInstance'
import { checkObject } from '../utils/checkObject'
import { checkResource } from '../utils/checkResource'
import { getElementPath } from '../utils/getElementPath'
import { updateResource } from '../utils/updateResource'
import { createSenML } from '../utils/createSenMLFormat'

export type sendParams = {
	resource: string
	newValue: string | boolean | number
	host: string
	objectsList: assetTracker
}

/**
 * Implement update action using Send Operation from Information Reporting interface.
 * Request uses SenML JSON as content format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf pag 71
 */
export const send = async (
	_: sendParams,
): Promise<assetTracker | void | undefined> => {
	const element = getElementPath(_.resource)

	// check input follows resource standard
	if (
		element.objectId === undefined ||
		element.instanceId === undefined ||
		element.resourceId === undefined
	)
		return undefined

	const object = checkObject(element, _.objectsList)
	const instance = checkInstance(object, element.instanceId)
	const resource = checkResource(instance, element.resourceId)

	// check if resource exist
	if (resource === undefined) return undefined
	const dataType = typeof resource
	let newValue = _.newValue
	if (dataType === "number") newValue = Number(newValue)
	if (dataType === "boolean") newValue = Boolean(newValue)
	const payload = createSenML(_.resource, _.newValue)

	const SenMLJson = 'application/senml+json'
	const host = _.host ?? process.env.host ?? ''
	const params = {
		host: host,
		port: 5683,
		pathname: '/dp',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format': SenMLJson,
		},
	}
	const agent = new coap.Agent({ type: 'udp4' })
	const request = agent.request(params).end(JSON.stringify(payload))

	const serverResponse = new Promise<coap.IncomingMessage>(
		(resolve, reject) => {
			const t = setTimeout(reject, 10 * 1000)
			request.on('response', (response) => {
				clearTimeout(t)
				if (response.code === '2.01' || response.code === '2.05') {
					return resolve(response)
				}
				return reject(new Error('Server does not accept the request'))
			})
		},
	)

	const response = await serverResponse

	if (response !== undefined) {
		const newList = updateResource(`${_.newValue}`, element, _.objectsList)
		return newList
	}
}
