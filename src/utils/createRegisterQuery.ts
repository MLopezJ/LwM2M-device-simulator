import 'dotenv/config'

/**
 * Build register query
 */
export const createRegisterQuery = (
	deviceName: string = process.env.deviceName ?? '',
	lifetime: number = process.env.lifetime !== undefined
		? Number(process.env.lifetime)
		: 0,
	lwM2MVersion: number = process.env.lwm2mV !== undefined
		? Number(process.env.lwm2mV)
		: 0.0,
	biding: string = process.env.biding ?? '',
): string => `ep=${deviceName}&lt=${lifetime}&lwm2m=${lwM2MVersion}&b=${biding}`
