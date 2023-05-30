import { assetTrackerFirmwareV2 } from "../assetTrackerV2.js";

/**
 * Given the LwM2M object id of a element should return its URN used in assetTracker def
 */
export const getLibUrn = (objectId: string): string | undefined =>  Object.keys(assetTrackerFirmwareV2)
    .filter(element => element.split(':')[0] === objectId)[0]