import type { assetTracker } from "../assetTrackerV2.js"
import { getElementPath } from "../utils/getElementPath.js"
import { typeOfElement } from "../utils/typeOfElement.js"
import { getValue } from "../utils/getValue.js"


/**
 * List object from object list
 */
export const list = (input: string| undefined, objectList: assetTracker): Partial<assetTracker> | undefined => {
    
    if (input === undefined){
        return objectList
    }

    const elementPath = getElementPath(input)
    const elementType = typeOfElement(input)

    if (elementType === undefined){
        console.log('Error: element type does not exist')
        return undefined
    }

    const element = getValue(elementPath,elementType,objectList)
    return element
}