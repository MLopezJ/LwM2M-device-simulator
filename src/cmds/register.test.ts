import { assetTrackerFirmwareV2 } from '../assetTrackerV2.js'
import {getObject} from '../cmds/register.js'

describe('getObject', ()=>{
    it("Should read from object and create buffer from its values", () => {
        const url = '/3'
        const result = JSON.parse(getObject(url, assetTrackerFirmwareV2).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('n', '0/0')
        expect(result.e[0]).toHaveProperty('sv', 'Nordic') 
    })

    it("Should read from instance and create buffer from its values", () => {
        const url = '/3/0'
        const result = JSON.parse(getObject(url, assetTrackerFirmwareV2).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('n', '0')
        expect(result.e[0]).toHaveProperty('sv', 'Nordic')  
    })

    it("Should read from resource and create buffer from its value", () => {
        const url = '/3/0/0'
        const result = JSON.parse(getObject(url, assetTrackerFirmwareV2).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('sv', 'Nordic')
        expect(result.e[0]).not.toHaveProperty('sv', '00010')
    })

    it("Should return object with null values if URL is not valid", () => {
        const url = '/4040404'
        const result = JSON.parse(getObject(url, assetTrackerFirmwareV2).toString())
        expect(result.bn).toBe(null)
        expect(result.e).toBe(null) 
    })
})

/*
describe('getPayload', ()=>{
    it("Should get payload when read action is requested", () => {
        const url = '/3'
        const result = JSON.parse(getPayload('read', url, assetTrackerFirmwareV2).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('n', '0/0')
        expect(result.e[0]).toHaveProperty('sv', 'Nordic') 
    })

    it("Should return empty string when not known action is requested", () => {
        const url = '/3'
        const result = getPayload('something', url, assetTrackerFirmwareV2).toString()
        expect(result).toBe('')
    })
})
*/