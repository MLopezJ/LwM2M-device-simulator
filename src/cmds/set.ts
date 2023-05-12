import type { assetTracker } from "../assetTrackerV2.js";
import { type element } from '../cmds/registerUtils'
import { checkObject } from "../utils/checkObject";
import { checkInstance } from "../utils/checkInstance";
import { checkResource } from "../utils/checkResource";
import { getUrn } from "../utils/getUrn";

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
    objectList![`${urn}`]![`${path.resourceId}`]! = newValue
  }
 
  return objectList
};
