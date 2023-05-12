import { typeOfElement } from "./typeOfElement"

describe('typeOfElement', () =>{
    it('Should detect object as the element type', () => {
      expect(typeOfElement('/3')).toBe('object')
    })
  
    it('Should detect instance as the element type', () => {
      expect(typeOfElement('/3/0')).toBe('instance')
    })
  
    it('Should detect resource as the element type', () => {
      expect(typeOfElement('/3/0/1')).toBe('resource')
    })
  
    it.each([
        '', 
        '/3/0/1/0', 
        '/3/0/1/0/1/1/1'
    ])('Should return undefined when format is not recognized in value sent by parameter: %p', (element: string) => {
      expect(typeOfElement(element)).toBe(undefined)
    })
  })