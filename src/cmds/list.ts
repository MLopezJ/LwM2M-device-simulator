import type { assetTracker } from "../assetTrackerV2"
import { getElementPath, getElementType } from "../utils"
import { getElementValue } from "../utils"


/**
 * List object from object list
 */
export const list = (command: string[], objectList: assetTracker): Partial<assetTracker> | assetTracker | undefined => {
    const cmd = command[0]
    
    if (cmd === undefined){
        return objectList
    }

    const elementPath = getElementPath(cmd)
    const elementType = getElementType(cmd)

    if (elementType === undefined){
        console.log('Error: element type does not exist')
        return undefined
    }

    const element = getElementValue(elementPath,elementType,objectList)
    return element
}