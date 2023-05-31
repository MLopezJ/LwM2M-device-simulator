import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import { correlationTable } from '../assetTrackerV2.js'

/**
 * "Translate" from LwM2M object id to @nordicsemiconductor/lwm2m-types id
 */
export const getUrn = (objectId: number): keyof LwM2MDocument =>
	correlationTable[`${objectId}`] as keyof LwM2MDocument
