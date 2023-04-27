import {assetTracker} from '../src/assetTrackerV2.js'

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
    if (objectId === '0') return '' // Security object should not be send

    const object = objectList[`${objectId}` as keyof assetTracker] // LwM2M element
    let elementString =  ''

    if (Array.isArray(object)){
      elementString = object.reduce((prev: string, curr: object, currentIndex: number) => {
        //              < object id  / instance id >
        const struct = `<${objectId}/${currentIndex}>`
        return currentIndex === 0 ? struct : `${prev}, ${struct}`
      }, '')
    } else {
      elementString = `<${objectId}/0>`
    }

    return previus === '' ? elementString : `${previus}, ${elementString}`
  }, '')
};

type value = {
  n: string
}

type stringValue = {
  sv: string
  v?: never
} & value

type numericValue = {
  sv?: never
  v: number
} & value

type e = stringValue | numericValue;

export type read = {
  bn: string
  e: e[]
};

/**
 * Read current rersource values from LwM2M Object
 */
export const readObject = (lwM2MObjects: object, objectId: string): read => {

    //const object = lwM2MObjects[`${objectId}`]

  return {
    bn: "/3",
    e: [
      { n: "0/0", sv: "Mauro L" },
      { n: "0/1", sv: "00010" },
      { n: "0/2", sv: "00000" },
      { n: "0/3", sv: "0.0" },
      { n: "0/6", sv: "1" },
      { n: "0/9", v: 80 },
      { n: "0/16", sv: "U" },
      { n: "0/18", sv: "0.0" },
      { n: "0/19", sv: "0.0" },
    ],
  };
};
