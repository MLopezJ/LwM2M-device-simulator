/**
 * Components of a LwM2M element
 * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_2-20201110-A/HTML-Version/OMA-TS-LightweightM2M_Core-V1_2-20201110-A.html#3-0-3-Terminology-and-Conventions 3.2. Definitions, for the meaning of each possible value
 */
export type elementType = 'object' | 'instance' | 'resource'

/**
 * Given a string with the following LwM2M format: /X/Y/Z where Y and Z are optionals and
 * X refers to object
 * Y to instance
 * and Z to resource,
 * identify which format belongs to the element
 */
export const typeOfElement = (element: string): elementType | undefined => {
	const amountOfSlashes = element.split('/').length - 1
	let elementType: elementType | undefined
	switch (amountOfSlashes) {
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
