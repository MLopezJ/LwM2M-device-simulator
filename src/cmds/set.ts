import { type assetTracker } from '../assetTrackerV2.js'
import { getElementPath, type element } from '../utils/getElementPath.js'
import { updateResource } from '../utils/updateResource.js'

/**
 * Execute the Set action
 */
export const set = (
	userInput: string[],
	list: assetTracker,
	getPath = (url: string) => getElementPath(url),
	changeResourceValue = (list: assetTracker, path: element, value: string) =>
		updateResource(list, path, value),
	registerNewValue = (bracketUrl: string, list: assetTracker) => {
		console.log('TODO', bracketUrl, list)
	},
): assetTracker | undefined => {
	const url = userInput[0] ?? ''
	const value = userInput[1] ?? ''
	const path = getPath(url)
	const newList = changeResourceValue(list, path, value)

	if (newList !== undefined) {
		const bracket = `<${url}>`
		registerNewValue(bracket, newList)
	}

	return newList
}
