import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import { correlationTable, type assetTracker } from '../assetTrackerV2.js'
import type { element } from './getElementPath'
import type { instance } from './getValue'

/**
 * Check if object exist in Asset Tracker and return it instance(s)
 */
export const checkObject = (
	path: element,
	objectList: assetTracker,
): instance | undefined => {
	const urn: keyof LwM2MDocument = correlationTable[
		`${path.objectId}`
	] as keyof LwM2MDocument
	const object = objectList[`${urn}`]

	if (object !== undefined) {
		return object as instance
	}

	return undefined
}
