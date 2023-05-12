import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types';
import type { elementType } from '../utils/typeOfElement.js'
import {assetTrackerFirmwareV2, type assetTracker} from '../assetTrackerV2.js'

/**
 * Given the LwM2M url of the object should return its URN used in assetTracker def
 * TODO: use method from lib
 */
export const getURN = (url: string): string | undefined =>  Object.keys(assetTrackerFirmwareV2).filter(element => element.split(':')[0] === url.split('/')[1])[0]

/**
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 57, last example
 */
type value = {
  n?: string
} 

type stringValue = {
  sv: string
  v?: never
} & value

type numericValue = {
  sv?: never
  v: number
} & value

export type e = stringValue | numericValue | Record<string, never>;


/**
 * Read current rersource values from LwM2M Object
 * and transform into vnd.oma.lwm2m+json format. 
 * 
 * This method creates the JSON variable 'e'. 
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 * 
 */
export const getResourceList = (values: object[] | object, elementType: 'object' | 'instance' | 'resource', resourcePath?: {objectId: number, instanceId: number ,resourceId: number}): e[] => {

  if (elementType === 'resource' && resourcePath !== undefined){
    const value = Array.isArray(values) ? values[resourcePath.instanceId] : values
    const resourceElement: string | number = value[`${resourcePath.resourceId}`]
    const key = typeof resourceElement === 'string' ? 'sv' : 'v'
    
    return [{[key]: resourceElement}] as e[]
  }


  // resourcePath
  const createList = (x: object, index: number) => {
    return Object.entries(x).reduce((previus: object[], current: [string, string|number]) => {
      const value = typeof current[1] === 'string' ? 'sv' : 'v'
      let result = {}

      // TODO: change to switch case
      if (elementType === 'object'){
        result = {n:`${index}/${current[0]}`, [value]: current[1]}
      }
      
      if (elementType === 'instance'){
        result = {n:`${current[0]}`, [value]: current[1]}
      }

      if (elementType === 'resource'){
        result = {[value]: current[1]}
      }
      
      previus.push(result)
      return previus
    }, [])
  }

  let e = [{}]
  if (Array.isArray(values)){
    e = values.map(((element: object, index: number) => {
      return createList(element, index)
    })).flat()
    return e
  } else {
    return createList(values, 0) as e[]
  }
};

/**
 * LwM2M element struct
 * < objectId / instanceId / resourceId >
 */
export type element = {
  objectId: number,
  instanceId: number,
  resourceId: number
}

/**
 * Split path in object, instance and resource
 * /object/instance/resource
 * 
 * -1 means no defined value
 */
export const getElementPath = (url: string): element => {
  const [,objectId, instanceId, resourceId] = url.split("/")
  return {
    objectId: objectId? Number(objectId): -1,
    instanceId: instanceId? Number(instanceId): -1,
    resourceId: resourceId? Number(resourceId): -1
  }
}

/**
 * Given an element and a list, should return the value of the element in list
 */
export const getElementValue = (element: element, typeOfElement: elementType, objectList: assetTracker) => {


  const id = getURN(`/${element.objectId}`)
  const temp = objectList[`${id}`  as keyof LwM2MDocument]

  if (temp === undefined){
    console.log('Error: object does not exist')
    return undefined
  } 

  if (typeOfElement === 'object'){
    return temp
  }

  const isSingleInstance = Array.isArray(temp) === false

  if (typeOfElement === 'instance'){
    
    
    if (isSingleInstance === true){
      if(element.instanceId !== 0){
        console.log('Error: element is single instance')
        return undefined
      }
      return temp
    }

    // TODO: solve this
    // @ts-ignore
    return temp[element.instanceId]
  }

  if (typeOfElement === 'resource'){
    // if object is single instance 
    if (isSingleInstance === true){
      // TODO: solve this
      // @ts-ignore
      return temp[`${element.resourceId}`]
    }
    // TODO: solve this
    // @ts-ignore
    return temp[element.instanceId][`${element.resourceId}`]
  }

  return undefined
}