import coap from 'coap'
import { type CoapMethod } from 'coap-packet'

/**
 * Send handshake request to LwM2M server
 */
export const handshake = async (
	agent: coap.Agent,
	bracketFormat: string,
	deviceNameParam = process.env.deviceName,
	lifetimeParam = process.env.lifetime,
	lwm2mVParam = process.env.lwm2mV,
	bidingParam = process.env.biding,
	portParam = process.env.port,
	hostParam = process.env.host,
): Promise<{ socketPort: number }> => {
	const deviceName = deviceNameParam ?? ''
	const lifetime = lifetimeParam !== undefined ? Number(lifetimeParam) : 0
	const lwm2mV = lwm2mVParam !== undefined ? Number(lwm2mVParam) : 0.0
	const biding = bidingParam ?? ''

	const query = new URLSearchParams('')
	query.set('ep', deviceName)
	query.set('lt', `${lifetime}`)
	query.set('lwm2m', `${lwm2mV}`)
	query.set('b', biding)

	const port = portParam !== undefined ? Number(portParam) : 0
	const host = hostParam ?? ''
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
	const payload = `</>;ct=${dataFormatId};hb,${bracketFormat}`

	const handShakeRequest = agent.request(params).end(payload)

	const serverResponse = new Promise<any>((resolve, reject) => {
		const t = setTimeout(reject, 10 * 1000)
		handShakeRequest.on('response', (response) => {
			clearTimeout(t)
			if (response.code === '2.01' || response.code === '2.05') {
				return resolve(response)
			}
			return reject(new Error('Server does not accept the request'))
		})
	})

	const response = await serverResponse

	const socketPort = response.outSocket?.port

	if (socketPort === undefined) {
		throw new Error(`Socket connection is not stablish`)
	}

	return { socketPort }
}
