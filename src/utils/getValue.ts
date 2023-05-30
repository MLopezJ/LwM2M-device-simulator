import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types';
import type { elementType } from '../utils/typeOfElement.js'
import { type assetTracker } from '../assetTrackerV2.js'
import type { element } from '../utils/getElementPath.js';
import { getLibUrn } from '../utils/getLibUrn.js';

type obj = Partial<assetTracker>
type instance = Partial<obj>
type resource = Partial<instance>

/**
 * Given an element and a list, should return the value of the element in list
 */
export const getValue = (element: element,  typeOfElement: elementType, objectList: assetTracker): undefined | obj | instance | resource=> {


  const id = getLibUrn(`${element.objectId}`)
  const temp = objectList[`${id}`  as keyof LwM2MDocument]

  if (temp === undefined){
    console.log('Error: object does not exist')
    return undefined
  } 

  if (typeOfElement === 'object'){
    return temp as Partial<assetTracker>
  }

  const isSingleInstance = Array.isArray(temp) === false

  if (typeOfElement === 'instance'){
    
    
    if (isSingleInstance === true){
      if(element.instanceId !== 0){
        console.log('Error: element is single instance')
        return undefined
      }
      return temp as instance
    }

    // TODO: solve this
    // @ts-ignore
    return temp[element.instanceId] as instance
  }

  if (typeOfElement === 'resource'){
    // if object is single instance 
    if (isSingleInstance === true){
      // TODO: solve this
      // @ts-ignore
      return temp[`${element.resourceId}`] as resource
    }
    // TODO: solve this
    // @ts-ignore
    return temp[element.instanceId][`${element.resourceId}`] as resource
  }

  return undefined
}
