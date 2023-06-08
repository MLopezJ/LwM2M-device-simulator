import jest from 'jest-mock'
import { assetTrackerFirmwareV2 } from "../assetTrackerV2"
import { register } from "./r"

describe('register', () => {
	it.only('should describe registration process', () => {

        const deviceObjects = assetTrackerFirmwareV2
        const requestRegistration = jest.fn()

        register(deviceObjects, requestRegistration)

		expect(requestRegistration).toBeCalledWith(deviceObjects)
	})
})
