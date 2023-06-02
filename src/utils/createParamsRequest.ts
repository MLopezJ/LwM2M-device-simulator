import { type CoapRequestParams } from 'coap'
import { type CoapMethod } from 'coap-packet'
import { config } from '../../config.js'

/**
 * Create data struct of request params
 */
export const createParamsRequest = (
	query: string,
	host: string = config.host,
	port: number = config.port,
	pathname = '/rd',
	method: CoapMethod = 'POST',
	options: Record<string, string> = {
		'Content-Format': 'application/link-format',
	},
): CoapRequestParams => {
	return {
		host: host,
		port: port,
		pathname: pathname,
		method: method,
		options: options,
		query: query,
	}
}
