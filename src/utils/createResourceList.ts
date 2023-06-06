import type { element } from './getElementPath'
import type { elementType } from './typeOfElement'

/**
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 57, last example
 */
type value = {
	n?: string
}

type stringValue = {
	sv: string
	v?: never
} & value

type numericValue = {
	sv?: never
	v: number
} & value

export type e = stringValue | numericValue | Record<string, never>

/**
 * Transform imput into variable 'e' of the application/vnd.oma.lwm2m+json format.
 *
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 *
 */
export const createResourceList = (
	values: object[] | object,
	typeOfElement: elementType,
	resourcePath?: element,
): e[] => {
	if (
		typeOfElement === 'resource' &&
		resourcePath?.instanceId !== undefined &&
		resourcePath.resourceId !== undefined
	) {
		const obj = Array.isArray(values) ? values[resourcePath.instanceId] : values
		return createFromResource(obj, resourcePath.resourceId)
	}

	if (Array.isArray(values)) {
		return createFromMultipleInstance(values, typeOfElement) as e[]
	} else {
		return createFromSingleInstance(values, typeOfElement)
	}
}

/**
 * create resource list from a resource element
 */
const createFromResource = (obj: object, resourceId: number) => {
	const id = `${resourceId}` as keyof object
	const value: string | number = obj[id]
	const dataType = getDataType(typeof value)
	return [{ [dataType]: value }] as e[]
}

/**
 * Create resource list from multiple instance object
 */
const createFromMultipleInstance = (
	values: object[],
	typeOfElement: elementType,
) =>
	values
		.map((element: object, index: number) => {
			return createMediaType(element, index, typeOfElement)
		})
		.flat()

/**
 * create resource list from single instance object
 */
const createFromSingleInstance = (
	values: object,
	typeOfElement: elementType,
	index = 0,
) => createMediaType(values, index, typeOfElement) as e[]

/**
 * create Media Type of application/vnd.oma.lwm2m+json.
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55. Table 22: JSON format and description
 */
const createMediaType = (
	obj: object,
	index: number,
	typeOfElement: elementType,
) => {
	return Object.entries(obj).reduce(
		(previus: object[], current: [string, string | number]) => {
			const dataType = getDataType(typeof current[1])

			let result = {}

			switch (typeOfElement) {
				case 'object':
					result = { n: `${index}/${current[0]}`, [dataType]: current[1] }
					break
				case 'instance':
					result = { n: `${current[0]}`, [dataType]: current[1] }
					break
				case 'resource':
					result = { [dataType]: current[1] }
					break
			}

			previus.push(result)
			return previus
		},
		[],
	)
}

/**
 * sv = string value
 * v = float value
 */
const getDataType = (input: string) => (input === 'string' ? 'sv' : 'v')
