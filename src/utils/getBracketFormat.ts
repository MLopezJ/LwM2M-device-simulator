import type { assetTracker } from "../assetTrackerV2"

/**
 * Transform object from json to the following string format: <X/Y>
 * Where:
 *      <> is an object
 *      X is the object id
 *      / is a dividerr between object id and resource id
 *      Y is a resource id
 */
export const getBracketFormat = (objectList: assetTracker): string => {
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
}