import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'

/**
 * Given the URN of the object check if it is part of the Asset Tracker v2
 */
export const isObjectInAssetTracker = (objectId: string): boolean =>
	Object.keys(assetTrackerFirmwareV2).includes(objectId)
