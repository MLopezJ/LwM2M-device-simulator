import { config } from '../../config.js'

/**
 * Build register query
 */
export const createRegisterQuery = (
	deviceName: string = config.deviceName,
	lifetime: number = config.lifetime,
	lwM2MVersion: number = config.lwm2mV,
	biding: string = config.biding,
): string => `ep=${deviceName}&lt=${lifetime}&lwm2m=${lwM2MVersion}&b=${biding}`
