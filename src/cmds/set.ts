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
	changeResourceValue = (value: string, path: element, list: assetTracker) =>
		updateResource(value, path, list),
	registerNewValue = (bracketUrl: string, list: assetTracker) => {
		console.log('TODO', bracketUrl, list)
	},
): assetTracker | undefined => {
	const url = userInput[0] ?? ''
	const newValue = userInput[1] ?? ''
	const element = getPath(url)
	const newList = changeResourceValue(newValue, element, list)

	if (newList !== undefined) {
		const bracket = `<${url}>`
		registerNewValue(bracket, newList)
	}

	return newList
}
