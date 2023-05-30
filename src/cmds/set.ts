import type { assetTracker } from "../assetTrackerV2.js";
import type { element } from "../utils/getElementPath.js"
import { checkObject } from "../utils/checkObject.js";
import { checkInstance } from "../utils/checkInstance.js";
import { checkResource } from "../utils/checkResource.js";
import { getUrn } from "../utils/getUrn.js";

/**
 * Set new value in LwM2M object list
 */
export const set = (
  objectList: assetTracker,
  path: element,
  value: string
): assetTracker | undefined => {

  // check if object exist 
  const object = checkObject(path,objectList)
  if (object === undefined) return undefined

  // check if instance exist 
  const instance = checkInstance(object, path.instanceId)
  if (instance === undefined) return undefined

  // check if resource exist 
  const resource = checkResource(instance, path.resourceId)
  if (resource === undefined) return undefined

  // set new value and retur 

  // set new data type taking in consideration last data type of element
  const newValue = typeof resource === 'number' ? Number(value) : value
  const urn = getUrn(path.objectId)

  // multiple instance
  if (Array.isArray(object) === true){
    // @ts-ignore
    objectList[`${urn}`]![path.instanceId]![`${path.resourceId}`] = newValue
  } else {
    // Single instance
    // @ts-ignore
    objectList[`${urn}`]![`${path.resourceId}`] = newValue
  }
 
  return objectList
};
