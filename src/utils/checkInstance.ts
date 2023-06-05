import { type instance, type resource } from './getValue.js'

/**
 * Check if instance exist in object and return it resources
 */
export const checkInstance = (
	object: instance,
	instanceId: number,
): undefined | resource => {
	// single instance
	if (Array.isArray(object) === false) {
		if (instanceId > 0) return undefined

		return object as resource
	}

	// repeat list validation to satisfy typescript concern about type 'number' can't be used to index type 'Partial<assetTracker>'.
	return Array.isArray(object) ? object[instanceId] : undefined
}
