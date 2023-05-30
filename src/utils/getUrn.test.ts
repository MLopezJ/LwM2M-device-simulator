import { Device_3_urn, Location_6_urn, Temperature_3303_urn, LwM2MServer_1_urn } from "@nordicsemiconductor/lwm2m-types"
import { getUrn } from "./getUrn.js"

describe('Get URN', () => {
    it.each([
        [3, Device_3_urn],
        [6, Location_6_urn],
        [3303, Temperature_3303_urn],
        [1, LwM2MServer_1_urn]
    ])("Should return URN of %p: %p", (objectId: number, result) => {
        expect(getUrn(objectId)).toBe(result)
    })

    it("Should return undefined if ID do not exist", () => {
        expect(getUrn(4040404)).toBe(undefined)
    })
})