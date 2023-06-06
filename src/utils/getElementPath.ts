/**
 * LwM2M element struct
 * < objectId / instanceId / resourceId >
 */
export type element = {
	objectId: number | undefined
	instanceId: number | undefined
	resourceId: number | undefined
}

/**
 * Split path in object, instance and resource
 */
export const getElementPath = (url: string): element => {
	const [, objectId, instanceId, resourceId] = url.split('/')
	return {
		objectId: objectId != null ? Number(objectId) : undefined,
		instanceId: instanceId != null ? Number(instanceId) : undefined,
		resourceId: resourceId != null ? Number(resourceId) : undefined,
	}
}
