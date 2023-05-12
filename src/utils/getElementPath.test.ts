import { getElementPath } from "./getElementPath"

describe('getElementPath', () =>{
    it.each([
      ['/3/0/1', {objectId: 3, instanceId: 0 ,resourceId: 1}],
      ['/3303/10/5700', {objectId: 3303, instanceId: 10 ,resourceId: 5700}],
    ])
    ('Should split path in different ids: %p', (path: string, obj: object) => {
      expect(getElementPath(path)).toMatchObject(obj)
    })
  
    it('Should return ids with -1 if there is an issue on its transformation', () => {
      expect(getElementPath('')).toMatchObject({objectId: -1, instanceId: -1 ,resourceId: -1})
    })
  })
