import type { assetTracker } from '../assetTrackerV2.js'
import { getElementPath } from '../utils/getElementPath.js'
import {
	getValue,
	type instance,
	type resourceValue,
} from '../utils/getValue.js'
import { typeOfElement } from '../utils/typeOfElement.js'

/**
 * List object from object list
 */
export const list = (
	input: string | undefined,
	objectList: assetTracker,
): Partial<assetTracker> | instance | resourceValue | undefined => {
	if (input === undefined) {
		return objectList
	}

	const elementPath = getElementPath(input)
	const elementType = typeOfElement(input)

	if (elementType === undefined) {
		console.log('Error: element type does not exist')
		return undefined
	}

	const element = getValue(elementPath, elementType, objectList)
	return element
}
