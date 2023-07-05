import type { element } from './getElementPath'
import type { elementType } from './typeOfElement'

/**
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 57, last example
 */
type value = {
	n?: string
	t?: number
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
 * Transform imput into Resource Array (variable 'e') of the application/vnd.oma.lwm2m+json format.
 * The Resource list is a JSON value array according to [SENML] with Array parameter extension (Object Link).
 *
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 *
 */
export const createResourceArray = (
	values: object[] | object,
	typeOfElement: elementType,
	time: number,
	resourcePath?: element,
): e[] => {
	if (
		typeOfElement === 'resource' &&
		resourcePath?.instanceId !== undefined &&
		resourcePath.resourceId !== undefined
	) {
		const obj = Array.isArray(values) ? values[resourcePath.instanceId] : values
		return createFromResource(obj, resourcePath.resourceId, time)
	}

	if (Array.isArray(values)) {
		return createFromMultipleInstance(values, typeOfElement, time) as e[]
	} else {
		return createFromSingleInstance(values, typeOfElement, undefined, time)
	}
}

/**
 * create resource list from a resource element
 */
const createFromResource = (obj: object, resourceId: number, time: number) => {
	const id = `${resourceId}` as keyof object
	const value: string | number = obj[id]
	const dataType = getDataType(typeof value)
	const array = [{ [dataType]: value }] as e[]
	if (time !== undefined && array[0] !== undefined) {
		array[0].t = time
	}
	return array
}

/**
 * Create resource list from multiple instance object
 */
const createFromMultipleInstance = (
	values: object[],
	typeOfElement: elementType,
	time: number,
) =>
	values
		.map((element: object, index: number) => {
			return createMediaType(element, index, typeOfElement, time)
		})
		.flat()

/**
 * create resource list from single instance object
 */
const createFromSingleInstance = (
	values: object,
	typeOfElement: elementType,
	index = 0,
	time: number,
) => createMediaType(values, index, typeOfElement, time) as e[]

/**
 * create Media Type of application/vnd.oma.lwm2m+json.
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55. Table 22: JSON format and description
 */
const createMediaType = (
	obj: object,
	index: number,
	typeOfElement: elementType,
	time: number,
) => {
	return Object.entries(obj).reduce(
		(previus: object[], current: [string, string | number]) => {
			const dataType = getDataType(typeof current[1])

			let result = {}

			switch (typeOfElement) {
				case 'object':
					result = {
						n: `${index}/${current[0]}`,
						[dataType]: current[1],
						t: time,
					}
					break
				case 'instance':
					result = { n: `${current[0]}`, [dataType]: current[1], t: time }
					break
				case 'resource':
					result = { [dataType]: current[1], t: time }
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
