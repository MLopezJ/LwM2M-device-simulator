import {
	CmdhDefaults_2050_urn,
	ConnectivityMonitoring_4_urn,
	ECID_SignalMeasurementInformation_10256_urn,
	Temperature_3303_urn,
	oAReceivingObject_3402_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { isObjectInAssetTracker } from './isObjectInAssetTracker.js'

describe('isObjectInAssetTracker', () => {
	it.each([
		['50009'],
		[ECID_SignalMeasurementInformation_10256_urn],
		[Temperature_3303_urn],
		[ConnectivityMonitoring_4_urn],
	])(
		'Should return true if the given object URN (%s) is part of the Asset Tracker v2 objects',
		(urn) => expect(isObjectInAssetTracker(urn)).toBe(true),
	)

	it.each([
		['40404'],
		['-1'],
		[oAReceivingObject_3402_urn],
		[CmdhDefaults_2050_urn],
	])(
		'Should return false if the given object URN (%s) is not part of Asset Tracker v2',
		(urn) => expect(isObjectInAssetTracker(urn)).toBe(false),
	)
})
