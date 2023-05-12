import type { element } from "../cmds/registerUtils.js"
import { assetTrackerFirmwareV2 } from "../assetTrackerV2"
import { checkObject } from "./checkObject"

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
    ])("Should check that object exist in asset tracker: %p", (element: element) => {
        const list = structuredClone(assetTrackerFirmwareV2)
        expect(checkObject(element, list)).not.toBe(undefined)
    })

    it("Should inform that object do not exist in asset tracker", () => {
        const element: element = {
            objectId: 101010101,
            instanceId: 0,
            resourceId: 0,
        }
        const list = structuredClone(assetTrackerFirmwareV2)
        expect(checkObject(element, list)).toBe(undefined)
    })
})