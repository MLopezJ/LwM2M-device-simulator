import { Device_3_urn, Temperature_3303_urn } from "@nordicsemiconductor/lwm2m-types"
import { assetTrackerFirmwareV2 } from "../assetTrackerV2.js"
import { checkInstance } from "./checkInstance.js"

describe("Check Instance", () => {
    it("Should check that instance exist in object (single instance object)", () => {
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = checkInstance(list[Device_3_urn] as any, 0)
        expect(result).toMatchObject(list[Device_3_urn]!)
    })

    it("Should check that instance exist in object (multiple instance object)", () => {
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = checkInstance(list[Temperature_3303_urn] as any, 0)
        expect(result).toMatchObject(list[Temperature_3303_urn]![0]!)
    })

    it("Should inform that instance do not exist in object (single instance object)", () => {
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = checkInstance(list[Device_3_urn] as any, 30)
        expect(result).toBe(undefined)
    })

    it("Should inform that instance do not exist in object (multiple instance object)", () => {
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = checkInstance(list[Temperature_3303_urn] as any, 30)
        expect(result).toBe(undefined)
    })
})