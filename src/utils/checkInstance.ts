
export type instance = Record<string, unknown> | Record<string, unknown>[]

/**
 * Check if instance exist in object
 */
export const checkInstance = (object: instance, instanceId: number): undefined | Record<string, unknown> => {
    // single instance
    if (Array.isArray(object) === false){
      if(instanceId > 0) return undefined
  
      return object as Record<string, unknown>
    }
  
    // repeat list validation to satisfy typescript concern about type 'number' can't be used to index type 'Partial<assetTracker>'.
    return Array.isArray(object) ? object[instanceId] : undefined


  }
  