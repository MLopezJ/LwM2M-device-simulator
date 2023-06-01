import { type instance } from './getValue.js'

/**
 * Check if resource exist in instance
 */
export const checkResource = (
	object: instance,
	resourceId: number,
): Record<string, unknown> | undefined => {
	const id = `${resourceId}` as keyof instance
	return object ? object[id] : undefined
}
