import coap from 'coap'
import { type CoapMethod } from 'coap-packet'

export type heartbeatParams = {
	deviceName: string | undefined
	lifetime: string | undefined
	port: number | undefined
	host: string | undefined
}

/**
 * Uses the "Update" operation from Register interface to refresh the registration, which
 * is useful for extending the lifetime of a registration
 *
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_2-20201110-A/HTML-Version/OMA-TS-LightweightM2M_Core-V1_2-20201110-A.html#Figure-622-1-Update-Example-Flow-1
 *
 */
export const heartbeat = async (
	_: heartbeatParams,
): Promise<{ code: string } | Error> => {
	const agent = new coap.Agent({ type: 'udp4' })
	const deviceName = _.deviceName ?? process.env.deviceName ?? ''
	const lifetime = _.lifetime ?? process.env.lifetime ?? '0'

	const query = new URLSearchParams('')
	query.set('ep', deviceName)
	query.set('lt', lifetime)

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
		query: `ep=${deviceName}&lt=${lifetime}`, //query.toString(), TODO: solve issue with query.toString()
	}

	const request = agent.request(params).end()

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

	const code = response.code

	if (code === undefined) {
		throw new Error(`Request was not successful`)
	}

	return { code }
}
