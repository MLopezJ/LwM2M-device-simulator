import { type assetTracker } from '../assetTrackerV2'
import { checkInstance } from './checkInstance'
import { checkObject } from './checkObject'
import { checkResource } from './checkResource'
import { type element } from './getElementPath'
import { getUrn } from './getUrn'
import { type resourceValue } from './getValue'

type instance = Record<string, resourceValue>
type resource = Record<string, unknown>

/**
 * Update resource value
 */
export const updateResource = (
	newValue: string,
	path: element,
	objectList: assetTracker,
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

	// Take in consideration last data type of the resource
	const value = typeof resource === 'number' ? Number(newValue) : newValue
	const urn = getUrn(path.objectId)

	// multiple instance case
	if (Array.isArray(object) === true) {
		;((objectList[`${urn}`] as instance[])[path.instanceId] as resource)[
			path.resourceId
		] = value
	} else {
		// Single instance case
		;(objectList[`${urn}`] as instance)[`${path.resourceId}`] = value
	}

	return objectList
}
