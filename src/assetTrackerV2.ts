import type {
	ConnectivityMonitoring_4,
	Device_3,
	ECID_SignalMeasurementInformation_10256,
	FirmwareUpdate_5,
	Humidity_3304,
	Location_6,
	LwM2MDocument,
	LwM2MServer_1,
	Pressure_3323,
	Pushbutton_3347,
	Temperature_3303,
} from '@nordicsemiconductor/lwm2m-types'

import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	ECID_SignalMeasurementInformation_10256_urn,
	FirmwareUpdate_5_urn,
	Humidity_3304_urn,
	Location_6_urn,
	LwM2MServer_1_urn,
	Pressure_3323_urn,
	Pushbutton_3347_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'

/**
 * Objects used by Asset Tracker V2 firmware.
 * @ref https://github.com/MLopezJ/nRF-Asset-Tracker-through-Coiote-flow/issues/3#issuecomment-1448074737
 *
 * List of values used in Asset Tracker web app
 * @ref https://github.com/MLopezJ/nRF-Asset-Tracker-through-Coiote-flow#data-transicion
 */

/**
 * LwM2M Security
 *
 * This LwM2M Object provides the keying material of a LwM2M Client appropriate to access a specified LwM2M Server.
 *
 * @see https://github.com/OpenMobileAlliance/lwm2m-registry/raw/prod/0.xml
 *
 * ID: 0
 * LWM2MVersion: 1.1
 * ObjectVersion: 1.2
 * MultipleInstances: true
 * Mandatory: true
 */
type Security_0 = Readonly<
	Array<{
		'0': string
		'1': boolean
		'2': number
		'3': string
		'4': string
		'5': string
		'10'?: number
	}>
>

/**
 * Security
 */
const security: Security_0 = [
	{
		'0': 'coap://eu.iot.avsystem.cloud:5683', // LWM2M  Server URI  - Coiote
		'1': false, // Bootstrap-Server
		'2': 3, // Security Mode
		'3': '', // Public Key or Identity
		'4': '', // Server Public Key
		'5': '', // Secret Key
		'10': 1, // Short Server ID
	},
]

/**
 * Server
 */
const server: LwM2MServer_1 = [
	{
		'0': 1, // Short Server ID
		'1': 60, // Lifetime --> During "Register" or "Update" operations, the parameter Lifetime – if present – MUST match the current value of the Mandatory Lifetime Resource of the LwM2M Server Object Instance
		'6': false, // Notification Storing When Disabled or Offline
		'7': 'U', // Binding
		//8: "true",// --> commented because of an issue with Registration Update Trigger
		'23': false,
	},
]

/**
 * Device
 */
const device: Device_3 = {
	'0': 'Nordic', // Manufacturer
	'1': '00010', // Model Number
	'2': '00000', // Serial Number
	'3': '0.0', // Firmware Version
	'6': 1, // Available Power Sources
	'7': 0, // Power Source Voltage
	'9': 80, // Battery Level
	'11': 0, // error code
	'13': 1651820400, // Current Time
	'16': 'U', // Supported Binding and Modes
	'18': '0.0', // hardware version
	'19': '0.0', // software version
}

/**
 * Connectivity Monitoring
 */
const connectMonitoring: ConnectivityMonitoring_4 = {
	'0': 6, // Network Bearer
	'1': 6,
	'2': -96, // Radio Signal Strength
	'3': 0,
	'4': '10.160.225.39', // IP Addresses
	'7': 'ibasis.iot',
	'8': 21627653, // Cell ID
	'9': 1,
	'10': 242,
	'11': 0,
	'12': 30401, // LAC = Location Area Code
}

/**
 * Firmaware update
 */
const firmawareUpdate: FirmwareUpdate_5 = {
	'0': '1.0.0',
	'1': '',
	'3': 0,
	'5': 1,
	'9': 2,
}

/**
 * Location
 */
const location: Location_6 = {
	'0': 10.366531, // Latitude
	'1': -84.51215, // Longitude
	'2': 0, // Altitude
	'3': 0, // Radius
	'4': '0', // Velocity
	'5': 1651820400, // Timestamp
	'6': 0, // Speed
}

/**
 * Temperature
 */
const temp: Temperature_3303 = [
	{
		'5518': 1651820400,
		'5601': 23.51,
		'5602': 23.51,
		'5603': -40,
		'5604': 85,
		'5700': 24.57, // Sensor Value
		'5701': 'Celsius degrees',
	},
]

/**
 * Humidity
 */
const humidity: Humidity_3304 = [
	{
		'5518': 1651820400,
		'5601': 31.06,
		'5602': 31.06,
		'5603': 0,
		'5604': 100,
		'5700': 28.93, // Sensor Value
		'5701': '%',
	},
]

/**
 * Pressure
 */
const pressure: Pressure_3323 = [
	{
		'5518': 1651820400,
		'5601': 98.24,
		'5602': 98.24,
		'5603': 30,
		'5604': 110,
		'5700': 98.23,
		'5701': 'kPa',
	},
]

/**
 * Push button
 */
const pushButton: Pushbutton_3347 = [
	{
		'5500': true,
		'5501': 0,
		'5518': 1651820400,
		'5750': 'Push button 1',
	},
]

/**
 * ECID-Signal Measurement Information
 */
const signalMeasurementInfo: ECID_SignalMeasurementInformation_10256 = [
	{
		'0': 247,
		'1': 0,
		'2': 6400,
		'3': -96,
		'4': -12,
		'5': 0,
	},
]

// TODO: Location Assistance (50001) is missing

/**
 * Asset Tracker Configuration
 *
 * Asset Tracker v2 configuration object
 *
 * @see https://github.com/NordicSemiconductor/asset-tracker-cloud-firmware-aws/blob/saga/src/cloud/lwm2m_integration/config_object_descript.xml
 *
 * ID: 50009
 * LWM2MVersion:
 * ObjectVersion:
 * MultipleInstances: false
 * Mandatory: false
 */
type Config_50009 = Readonly<{
	'0': boolean
	'1': number
	'2': number
	'3': number
	'4': number
	'5': number
	'6': boolean
	'7': boolean
	'8': number
	'9': number
}>

/**
 * Asset Tracker v2 configuration object
 */
const config: Config_50009 = {
	'0': false, // Passive mode
	'1': 45654, // Location timeout
	'2': 3, // Active wait time
	'3': 45, // Movement resolution
	'4': 45, // Movement timeout
	'5': 1, // Accelerometer activity threshold
	'6': false, // GNSS enable
	'7': true, // Neighbor cell measurements enable
	'8': 78, // Accelerometer inactivity threshold
	'9': 63, // Accelerometer inactivity timeout
}

// TODO: add complete list of LwM2M objects
export const lwm2mObjects: LwM2MDocument = {
	[LwM2MServer_1_urn]: server,
	[Device_3_urn]: device,
	[ConnectivityMonitoring_4_urn]: connectMonitoring,
	[FirmwareUpdate_5_urn]: firmawareUpdate,
	[Location_6_urn]: location,
	[Temperature_3303_urn]: temp,
	[Humidity_3304_urn]: humidity,
	[Pressure_3323_urn]: pressure,
	[Pushbutton_3347_urn]: pushButton,
	[ECID_SignalMeasurementInformation_10256_urn]: signalMeasurementInfo,
}

export type assetTracker = {
	'0': Security_0
	'50009'?: Config_50009
} & LwM2MDocument

export const assetTrackerFirmwareV2: assetTracker = {
	'0': security,
	...lwm2mObjects,
	'50009': config,
}

export const correlationTable: Record<string, string> = {
	'0': '0',
	'1': LwM2MServer_1_urn,
	'3': Device_3_urn,
	'4': ConnectivityMonitoring_4_urn,
	'5': FirmwareUpdate_5_urn,
	'6': Location_6_urn,
	'3303': Temperature_3303_urn,
	'3304': Humidity_3304_urn,
	'3323': Pressure_3323_urn,
	'3347': Pushbutton_3347_urn,
	'10256': ECID_SignalMeasurementInformation_10256_urn,
	'50009': '50009',
}
