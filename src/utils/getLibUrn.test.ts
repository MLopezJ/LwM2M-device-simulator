import { ConnectivityMonitoring_4_urn, Device_3_urn, ECID_SignalMeasurementInformation_10256_urn, LwM2MServer_1_urn, Temperature_3303_urn } from "@nordicsemiconductor/lwm2m-types"
import { getLibUrn } from "./getLibUrn.js"

describe('getLibUrn', () =>{
    it('Should return the object URN given the object id', () => {
        expect(getLibUrn('3')).toBe(Device_3_urn)
        expect(getLibUrn('10256')).toBe(ECID_SignalMeasurementInformation_10256_urn)
        expect(getLibUrn('3303')).toBe(Temperature_3303_urn)
        expect(getLibUrn('4')).toBe(ConnectivityMonitoring_4_urn)
        expect(getLibUrn('1')).toBe(LwM2MServer_1_urn)
    })

    it('Should return undefined if object is not found by the given id', () => {
        expect(getLibUrn('40404')).toBe(undefined)
    })
})

