import { getURN } from '@nordicsemiconductor/lwm2m-types'
import { type assetTracker } from '../assetTrackerV2.js'
import type { element } from '../utils/getElementPath.js'
import type { elementType } from '../utils/typeOfElement.js'

type ValueOf<T> = T[keyof T]
export type instance = ValueOf<Partial<assetTracker>>
export type resourceValue = string | number | boolean
export type resource =
	| Record<string, resourceValue>
	| Record<string, resourceValue>[]

/**
 * Given an element and a list, should return the value of the element in list
 */
export const getValue = async (
	request: elementType,
	element: element,
	from: assetTracker,
): Promise<undefined | instance | resourceValue> => {
	const id = await getURN(`${element.objectId}`)
	const value = from[`${id}` as keyof assetTracker] as ValueOf<assetTracker>

	if (value === undefined) {
		console.log('Error: object does not exist')
		return undefined
	}

	const isSingleInstance = Array.isArray(value) === false

	switch (request) {
		// <X/y/z>
		case 'object':
			return value
		// <x/Y/z>
		case 'instance':
			return getInstance(isSingleInstance, element.instanceId, value)
		// <x/y/Z>
		case 'resource':
			return getResource(
				isSingleInstance,
				element.instanceId,
				element.resourceId,
				value,
			)
		default:
			return undefined
	}
}

/**
 * Get instance from object
 */
const getInstance = (
	isSingleInstance: boolean,
	instanceId: number | undefined,
	instance: instance | instance[],
): instance | undefined => {
	if (instanceId === undefined) return undefined
	if (isSingleInstance === true) {
		if (instanceId !== 0) {
			console.log('Error: element is single instance')
			return undefined
		}
		return instance as instance
	}

	const list = instance as instance[]
	return list[instanceId]
}

/**
 * Get resource from Instance
 */
const getResource = (
	isSingleInstance: boolean,
	instanceId: number | undefined,
	resourceId: number | undefined,
	instance: instance | instance[],
): string | number | boolean | undefined => {
	const key = `${resourceId}` as keyof instance

	// single instance object
	if (isSingleInstance === true) {
		return getSingleResource(instance as instance, key)
	}

	// multiple instance resource
	const list = instance as instance[]
	if (instanceId === undefined) return undefined
	return getSingleResource(list[instanceId], key)
}

/**
 * Get resource from single instance
 */
const getSingleResource = (
	instance: instance | undefined,
	key: keyof instance,
) => {
	if (instance !== undefined) {
		return instance[key]
	}
	return undefined
}
