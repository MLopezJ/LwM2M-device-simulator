import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { assetTracker } from '../assetTrackerV2.js'

/**
 * Transform objects from json to the following string format: <X/Y>
 * Where:
 *      <> is an object
 *      X is the object id
 *      / is a divider between object id and resource id
 *      Y is the resource id
 */
export const getBracketFormat = (objectList: assetTracker | string): string => {
	if (typeof objectList === 'string') return `<${objectList}>`

	const ids = Object.keys(objectList)

	return ids.reduce((previus: string, urn: string) => {
		const parsedURN = parseURN(urn)
		const id = parsedURN.ObjectID

		if (id === '0') return '' // Security object should not be send

		const object = objectList[`${urn}` as keyof assetTracker] // LwM2M element
		let elementString = ''

		if (Array.isArray(object)) {
			elementString = object.reduce(
				(prev: string, curr: object, currentIndex: number) => {
					//              < object id  / instance id >
					const struct = `<${id}/${currentIndex}>`
					return currentIndex === 0 ? struct : `${prev}, ${struct}`
				},
				'',
			)
		} else {
			elementString = `<${id}/0>`
		}

		return previus === '' ? elementString : `${previus}, ${elementString}`
	}, '')
}
