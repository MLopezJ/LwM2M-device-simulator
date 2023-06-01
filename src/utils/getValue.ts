import { type assetTracker } from '../assetTrackerV2.js'
import type { element } from '../utils/getElementPath.js'
import { getLibUrn } from '../utils/getLibUrn.js'
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
export const getValue = (
	element: element,
	typeOfElement: elementType,
	objectList: assetTracker,
): undefined | instance | resourceValue => {
	const id = getLibUrn(`${element.objectId}`)
	const value = objectList[
		`${id}` as keyof assetTracker
	] as ValueOf<assetTracker>

	if (value === undefined) {
		console.log('Error: object does not exist')
		return undefined
	}

	const isSingleInstance = Array.isArray(value) === false

	switch (typeOfElement) {
		// <X/y/y>
		case 'object':
			return value
		// <y/X/y>
		case 'instance':
			return getInstance(isSingleInstance, element.instanceId, value)
		// <y/y/X>
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
	instanceId: number,
	instance: instance | instance[],
): instance | undefined => {
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
	instanceId: number,
	resourceId: number,
	instance: instance | instance[],
): string | number | boolean | undefined => {
	const key = `${resourceId}` as keyof instance

	// single instance object
	if (isSingleInstance === true) {
		return getSingleResource(instance as instance, key)
	}

	// multiple instance resource
	const list = instance as instance[]
	return getSingleResource(list[instanceId], key)
}

/**
 *
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
