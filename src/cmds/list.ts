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
export const list = async (
	input: string | undefined,
	objectList: assetTracker,
): Promise<Partial<assetTracker> | instance | resourceValue | undefined> => {
	if (input === undefined) {
		return objectList
	}

	const request = typeOfElement(input)
	const element = getElementPath(input)

	if (request === undefined) {
		console.log('Error: element type does not exist')
		return undefined
	}

	const from = objectList

	const result = await getValue(request, element, from)
	return result
}
