import type { assetTracker } from "../assetTrackerV2"
import { getElementPath, getElementType } from "./registerUtils"
import { getElementValue } from "./registerUtils"


/**
 * List object from object list
 */
export const list = (input: string| undefined, objectList: assetTracker): Partial<assetTracker> | assetTracker | undefined => {
    
    if (input === undefined){
        return objectList
    }

    const elementPath = getElementPath(input)
    const elementType = getElementType(input)

    if (elementType === undefined){
        console.log('Error: element type does not exist')
        return undefined
    }

    const element = getElementValue(elementPath,elementType,objectList)
    return element
}