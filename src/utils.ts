import {type assetTracker} from '../src/assetTrackerV2.js'

// TODO: add description
export const serverReqParser = (req: {
  code: string
  _packet: { confirmable: unknown }
  payload: string | unknown[]
  method: unknown
  headers: { [x: string]: unknown; Observe: number; Accept: string }
  url: string
}): string => {
  let optType;

  if (
    req.code === "0.00" &&
    (Boolean(req._packet.confirmable)) &&
    req.payload.length === 0
  ) {
    optType = "empty";
  } else {
    switch (req.method) {
      case "GET":
        if (req.headers.Observe === 0) optType = "observe";
        else if (req.headers.Observe === 1) optType = "cancelObserve";
        else if (req.headers.Accept === "application/link-format")
          optType = "discover";
        else optType = "read";
        break;
      case "PUT":
        if (Boolean(req.headers["Content-Format"]) === true) optType = "write";
        else optType = "writeAttr";
        break;
      case "POST":
        if (req.url === "/ping") optType = "ping";
        else if (req.url === "/bs") optType = "finish";
        else if (req.url === "/announce") optType = "announce";
        else if (Boolean(req.headers["Content-Format"]) === true) optType = "create";
        else optType = "execute";
        break;
      case "DELETE":
        optType = "delete";
        break;
      default:
        optType = "empty";
        break;
    }
  }

  return optType;
};

/**
 * Generate the list of LwM2M objects that are goint to be send in the registration interface
 * example: <LwM2M Object id/ instance id>, <LwM2M Object id/ instance id>
 * // TODO: update method with new asset tracker v2 object struct
 */
export const getObjectsToRegister = (objectList: assetTracker): string => {

  const ids = Object.keys(objectList)
  
  return  ids.reduce((previus: string, objectId: string) => {
    const id = objectId.split(':')[0] // TODO: uses lib fuction
    if (id === '0') return '' // Security object should not be send

    const object = objectList[`${objectId}` as keyof assetTracker] // LwM2M element
    let elementString =  ''

    if (Array.isArray(object)){
      elementString = object.reduce((prev: string, curr: object, currentIndex: number) => {
        //              < object id  / instance id >
        const struct = `<${id}/${currentIndex}>`
        return currentIndex === 0 ? struct : `${prev}, ${struct}`
      }, '')
    } else {
      elementString = `<${id}/0>`
    }

    return previus === '' ? elementString : `${previus}, ${elementString}`
  }, '')
};


/**
 * Given the LwM2M url of the object should return its URN used in assetTracker def
 * TODO: use method from lib
 */
export const getURN = (url: string, objectsList: assetTracker): string | undefined =>  Object.keys(objectsList).filter(element => element.split(':')[0] === url.split('/')[1])[0]

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
 * Return the element type that the LwM2M Server is requesting.
 * 
 * The parameter of the function will have the following struct: < OBJECT / INSTANCE / RESOURCE >
 */
export const getElementType = (element: string) : "object" | "instance" | "resource" | undefined => {
  const amountOfSlashes = (element.split("/").length - 1)
    let elementType: "object" | "instance" | "resource" | undefined
    switch(amountOfSlashes){
        case 1:
            elementType = 'object'
            break
        case 2:
            elementType = 'instance'
            break
        case 3:
            elementType = 'resource'
            break
        default:
            elementType = undefined
    }
    return elementType
}

/**
 * Split path in object, instance and resource
 * /object/instance/resource
 */
export const getElementPath = (url: string): {objectId: number, instanceId: number, resourceId: number} => {
  const [objectId, instanceId, resourceId] = url.split("/")
  return {
    objectId: objectId? Number(objectId): -1,
    instanceId: instanceId? Number(instanceId): -1,
    resourceId: resourceId? Number(resourceId): -1
  }
}
