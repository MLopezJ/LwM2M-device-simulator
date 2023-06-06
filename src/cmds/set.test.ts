import jest from 'jest-mock'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { type element } from '../utils/getElementPath'
import { set } from './set'

describe('Set command', () => {
	it('should update resource with value and register it in server', () => {
		const userInput = ['/3/0/0', 'Mauro']
		const url = userInput[0]
		const newValue = userInput[1]
		const path = {
			objectId: 3,
			instanceId: 0,
			resourceId: 0,
		}

		const getPath = jest.fn().mockReturnValue(path) as () => element
		const changeResourceValue = jest
			.fn()
			.mockReturnValue(assetTrackerFirmwareV2) as () => assetTracker
		const registerNewValue = jest.fn()

		set(
			userInput,
			assetTrackerFirmwareV2,
			getPath,
			changeResourceValue,
			registerNewValue,
		)

		expect(getPath).toHaveBeenCalledWith(url)
		expect(changeResourceValue).toHaveBeenCalledWith(
			assetTrackerFirmwareV2,
			path,
			newValue,
		)

		const bracket = `<${url}>`
		expect(registerNewValue).toHaveBeenCalledWith(
			bracket,
			assetTrackerFirmwareV2,
		)
	})
})
