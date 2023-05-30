import type { element } from "../utils/getElementPath.js"
import { assetTrackerFirmwareV2 } from "../assetTrackerV2.js"
import { set } from '../cmds/set.js'
import { Device_3_urn, Temperature_3303_urn } from "@nordicsemiconductor/lwm2m-types"

describe("Set", () => {

    it("Should set new value to resource", () => {
        const element : element = {
            objectId: 3,
            instanceId: 0,
            resourceId: 0,
        }
        const value = "new value"
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = set(list, element,value)
        expect(result?.[Device_3_urn]?.["0"]).toBe(value)
    })

    it("Should set new numeric value to resource", () => {
        const element : element = {
            objectId: 3,
            instanceId: 0,
            resourceId: 9,
        }
        const value = "100"
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = set(list, element,value)
        expect(result?.[Device_3_urn]?.["9"]).toBe(Number(value))
    })

    it("Should set new value to resource (multiple instance object)", () => {
        const element : element = {
            objectId: 3303,
            instanceId: 0,
            resourceId: 5701,
        }
        const value = "new value"
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = set(list, element,value)
        expect(result?.[Temperature_3303_urn]?.[0]?.["5701"]).toBe(value)
    })

    it("Should set new numeric value to resource (multiple instance object)", () => {
        const element : element = {
            objectId: 3303,
            instanceId: 0,
            resourceId: 5700,
        }
        const value = "100"
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = set(list, element,value)
        expect(result?.[Temperature_3303_urn]?.[0]?.["5700"]).toBe(Number(value))
    })

    it.each([
        [{
            objectId: 10101, // object do not exist
            instanceId: 0,
            resourceId: 0,
        }],
        [{
            objectId: 3,
            instanceId: 10101, // instance do not exist
            resourceId: 0,
        }],
        [{
            objectId: 3,
            instanceId: 0,
            resourceId: 10101, // resource do not exist
        }],
        [{
            objectId: 3303,
            instanceId: 10101, // instance do not exist
            resourceId: 0,
        }],
        [{
            objectId: 3303,
            instanceId: 0,
            resourceId: 10101, // resource do not exist
        }]
    ])("Should return undefined when element do not exist: %p", (element: element) => {
        const value = "new value"
        const list = structuredClone(assetTrackerFirmwareV2)
        const result = set(list, element,value)
        expect(result).toBe(undefined)
    })
})
