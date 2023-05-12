
/**
 * Components of a LwM2M element
 */
export type elementType = "object" | "instance" | "resource"

/**
 * Given a string with the following LwM2M format: /X/Y/Z where Y and Z are optionals
 * identify which is the type of it
 */
export const typeOfElement = (element: string): elementType | undefined => {
    const amountOfSlashes = (element.split("/").length - 1)
      let elementType: "object" | "instance" | "resource" | undefined
      switch(amountOfSlashes){
          case 1:
              elementType = 'object'
              break
          case 2:
              elementType = 'instance'
              break
          case 3:
              elementType = 'resource'
              break
          default:
              elementType = undefined
      }
      return elementType
}
