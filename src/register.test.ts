import {read} from '../src/register.js'

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

    it("Should read from instance and create buffer from its values", () => {
        const url = '/3/0'
        const result = JSON.parse(read(url).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('n', '0')
        expect(result.e[0]).toHaveProperty('sv', 'Nordic')  
    })

    it("Should read from resource and create buffer from its value", () => {
        const url = '/3/0/0'
        const result = JSON.parse(read(url).toString())
        expect(result.bn).toBe(url)
        expect(result.e[0]).toHaveProperty('sv', 'Nordic')
        expect(result.e[0]).not.toHaveProperty('sv', '00010')
        
    })
   
})