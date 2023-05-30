
/**
 * LwM2M element struct
 * < objectId / instanceId / resourceId >
 */
export type element = {
    objectId: number
    instanceId: number
    resourceId: number
  }

/**
 * Split path in object, instance and resource
 * 
 * -1 means no defined value
 */
export const getElementPath = (url: string): element => {
    const [,objectId, instanceId, resourceId] = url.split("/")
    return {
      objectId: (objectId != null)? Number(objectId): -1,
      instanceId: (instanceId != null)? Number(instanceId): -1,
      resourceId: (resourceId != null)? Number(resourceId): -1
    }
  }