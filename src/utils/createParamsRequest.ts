import { type CoapRequestParams } from 'coap'
import { type CoapMethod } from 'coap-packet'

/**
 * Create data struct of request params
 */
export const createParamsRequest = (
	query: string,
	host = process.env.host !== undefined ? process.env.host : 'sdf',
	port = process.env.port !== undefined ? Number(process.env.port) : 0,
	pathname = '/rd',
	method: CoapMethod = 'POST',
	options: Record<string, string> = {
		'Content-Format': 'application/link-format',
	},
): CoapRequestParams => {
	console.log(process.env.host)
	return {
		host: host,
		port: port,
		pathname: pathname,
		method: method,
		options: options,
		query: query,
	}
}
