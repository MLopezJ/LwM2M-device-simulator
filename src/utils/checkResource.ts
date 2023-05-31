/**
 * Check if resource exist in object
 */
export const checkResource = (
	object: Record<string, unknown>,
	resourceId: number,
): unknown => object[`${resourceId}`]
