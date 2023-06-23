import { Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import jest from 'jest-mock'
import { assetTrackerFirmwareV2, type assetTracker } from '../assetTrackerV2'
import { type element } from '../utils/getElementPath'
import { updateResource } from '../utils/updateResource.js'
import { set } from './set'

describe('Set command', () => {
	it('should update resource with value, register it in server and return list with new value as part of the state of Device Objects', () => {
		const userInput = ['/3/0/0', 'Mauro']
		const url = userInput[0]
		const newValue = userInput[1]
		const path = {
			objectId: 3,
			instanceId: 0,
			resourceId: 0,
		}
		const deviceObjects = assetTrackerFirmwareV2

		const getPath = jest.fn().mockReturnValue(path) as () => element

		const changeResourceValue = jest.fn().mockImplementationOnce(() => {
			const list = structuredClone(deviceObjects)
			return updateResource(newValue ?? '', path, list)
			/*
				const newDeviceObjects = structuredClone(deviceObjects)
				// @ts-ignore: TODO: solve this. Remove readonly
				newDeviceObjects[Device_3_urn]?.['0'] = newValue 
				return newDeviceObjects
				*/
		}) as () => assetTracker

		const registerNewValue = jest.fn()

		const result = set(
			userInput,
			deviceObjects,
			getPath,
			changeResourceValue,
			registerNewValue,
		)

		// identify object id, resource id and resource id from url
		expect(getPath).toHaveBeenCalledWith(url)

		// update the value in Device Objects
		expect(changeResourceValue).toHaveBeenCalledWith(
			newValue,
			path,
			deviceObjects,
		)

		const bracket = `<${url}>`
		// register new resource in LwM2M Server
		expect(registerNewValue).toHaveBeenCalledWith(bracket, result)

		// expect to return a new state of Device Objects
		expect(result?.[Device_3_urn]?.['0']).toBe(newValue)
		expect(deviceObjects?.[Device_3_urn]?.['0']).not.toBe(newValue)
	})
})
