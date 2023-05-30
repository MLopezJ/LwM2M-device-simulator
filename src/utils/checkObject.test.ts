
import { assetTrackerFirmwareV2 } from "../assetTrackerV2.js"
import { checkObject } from "./checkObject.js"
import type { element } from "./getElementPath"

describe("Check Object", () => {
    it.each([
        [{
            objectId: 3,
            instanceId: 0,
            resourceId: 0,
        }],
        [{
            objectId: 3303,
            instanceId: 0,
            resourceId: 0,
        }]
    ])("Should check that object exist in asset tracker: %p", (path: element) => {
        const list = structuredClone(assetTrackerFirmwareV2)
        expect(checkObject(path, list)).not.toBe(undefined)
    })

    it("Should inform that object do not exist in asset tracker", () => {
        const path: element = {
            objectId: 101010101,
            instanceId: 0,
            resourceId: 0,
        }
        const list = structuredClone(assetTrackerFirmwareV2)
        expect(checkObject(path, list)).toBe(undefined)
    })
})