import {read, responseToCoioteAlternative} from '../src/register.js'

describe('responseToCoioteAlternative', ()=>{
    it("Should read object value and build payload", () => {
        expect(responseToCoioteAlternative('read', '/3')).toBeInstanceOf(Buffer)
    })
})

describe('Read', ()=>{
    it("Should read from object and create buffer from its values", () => {
        const url = '/3'
        const result = JSON.parse(read(url).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('n', '0/0')
        expect(result.e[0]).toHaveProperty('sv', 'Nordic') 
    })

    it("Should return object with null values if URL is not valid", () => {
        const url = '/4040404'
        const result = JSON.parse(read(url).toString())
        expect(result.bn).toBe(null)
        expect(result.e).toBe(null) 
    })
})