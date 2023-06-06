import type { assetTracker } from '../assetTrackerV2.js'
import { checkInstance } from '../utils/checkInstance.js'
import { checkObject } from '../utils/checkObject.js'
import { checkResource } from '../utils/checkResource.js'
import type { element } from '../utils/getElementPath.js'
import { getUrn } from '../utils/getUrn.js'
import { type resourceValue } from '../utils/getValue.js'

type instance = Record<string, resourceValue>
type resource = Record<string, unknown>

/**
 * Set new value in LwM2M object list
 */
export const set = (
	objectList: assetTracker,
	path: element,
	value: string,
): assetTracker | undefined => {
	// check if object exist
	if (path.objectId === undefined) return undefined
	const object = checkObject(path, objectList)
	if (object === undefined) return undefined

	// check if instance exist
	if (path.instanceId === undefined) return undefined
	const instance = checkInstance(object, path.instanceId)
	if (instance === undefined) return undefined

	// check if resource exist
	if (path.resourceId === undefined) return undefined
	const resource = checkResource(instance, path.resourceId)
	if (resource === undefined) return undefined

	// set new value and return

	// set new data type taking in consideration last data type of element
	const newValue = typeof resource === 'number' ? Number(value) : value
	const urn = getUrn(path.objectId)

	// multiple instance
	if (Array.isArray(object) === true) {
		;((objectList[`${urn}`] as instance[])[path.instanceId] as resource)[
			path.resourceId
		] = newValue
	} else {
		// Single instance
		;(objectList[`${urn}`] as instance)[`${path.resourceId}`] = newValue
	}

	return objectList
}
