import { type assetTracker } from '../assetTrackerV2.js'
import { getElementPath, type element } from '../utils/getElementPath.js'
import { updateResource } from '../utils/updateResource.js'
import { registerDeviceObjects, type registrationParams } from './reg.js'

/**
 * Execute the Set action
 */
export const set = async (
	userInput: string[],
	list: assetTracker,
	getPath = (url: string) => getElementPath(url),
	changeResourceValue = (value: string, path: element, list: assetTracker) =>
		updateResource(value, path, list),
): Promise<assetTracker | undefined> => {
	const url = userInput[0] ?? ''
	const newValue = userInput[1] ?? ''
	const element = getPath(url)
	const newList = changeResourceValue(newValue, element, list)

	if (newList !== undefined) {
		// register new values in server
		const params: registrationParams = {
			deviceObjects: newList,
			resource: undefined, //url,
			deviceName: undefined,
			lifetime: undefined,
			biding: undefined,
			port: undefined,
			host: undefined,
			lwm2mV: undefined,
		}
		await registerDeviceObjects(params)
	}

	return newList
}
