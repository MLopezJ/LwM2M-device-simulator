import coap from 'coap'
import { type CoapMethod } from 'coap-packet'

export type handshakeParams = {
	agent: coap.Agent
	objects: string
	deviceName: string | undefined
	lifetime: string | undefined
	biding: string | undefined
	port: number | undefined
	host: string | undefined
	lwm2mV: string | undefined
}

/**
 * Send handshake request to LwM2M server
 */
export const handshake = async (
	_: handshakeParams,
): Promise<{ socketPort: number }> => {
	const deviceName = _.deviceName ?? process.env.deviceName ?? ''
	const lifetime = _.lifetime ?? process.env.lifetime ?? '0'
	const lwm2mV = _.lwm2mV ?? process.env.lwm2mV ?? ''
	const biding = _.biding ?? process.env.biding ?? ''

	const query = new URLSearchParams('')
	query.set('ep', deviceName)
	query.set('lt', lifetime)
	query.set('lwm2m', lwm2mV)
	query.set('b', biding)

	let port = 0
	if (_.port !== undefined) port = _.port
	if (process.env.port !== undefined) port = Number(process.env.port)

	const host = _.host ?? process.env.host ?? ''
	const params = {
		host: host,
		port: port,
		pathname: '/rd',
		method: 'POST' as CoapMethod,
		options: {
			'Content-Format': 'application/link-format',
		},
		query: query.toString(),
	}

	const dataFormatId = '11543'
	const payload = `</>;ct=${dataFormatId};hb,${_.objects}`

	const handshakeRequest = _.agent.request(params).end(payload)

	const serverResponse = new Promise<coap.IncomingMessage>(
		(resolve, reject) => {
			const t = setTimeout(reject, 10 * 1000)
			handshakeRequest.on('response', (response) => {
				clearTimeout(t)
				if (response.code === '2.01' || response.code === '2.05') {
					return resolve(response)
				}
				return reject(new Error('Server does not accept the request'))
			})
		},
	)

	const response = await serverResponse

	const socketPort = response.outSocket?.port

	if (socketPort === undefined) {
		throw new Error(`Socket connection is not stablish`)
	}

	return { socketPort }
}
