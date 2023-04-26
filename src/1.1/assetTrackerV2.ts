import type {
  LwM2MDocument,
  LwM2MServer_1,
  Device_3,
  ConnectivityMonitoring_4,
  FirmwareUpdate_5,
  Location_6,
  Temperature_3303,
  Humidity_3304,
  Pressure_3323,
  Pushbutton_3347,
  ECID_SignalMeasurementInformation_10256,
} from "@nordicsemiconductor/lwm2m-types";

import {
  LwM2MServer_1_urn,
  Device_3_urn,
  ConnectivityMonitoring_4_urn,
  FirmwareUpdate_5_urn,
  Location_6_urn,
  Temperature_3303_urn,
  Humidity_3304_urn,
  Pressure_3323_urn,
  Pushbutton_3347_urn,
  ECID_SignalMeasurementInformation_10256_urn,
} from "@nordicsemiconductor/lwm2m-types";

/**
 * Objects used by Asset Tracker V2 firmware.
 * @ref https://github.com/MLopezJ/nRF-Asset-Tracker-through-Coiote-flow/issues/3#issuecomment-1448074737
 *
 * List of values used in Asset Tracker web app
 * @ref https://github.com/MLopezJ/nRF-Asset-Tracker-through-Coiote-flow#data-transicion
 */

/**
 * Security
 * TODO: add type from lwm2m-types lib
 */
const security = [
  {
    "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
    "1": false, // Bootstrap-Server
    "2": 3, // Security Mode
    "3": "", // ** Public Key or Identity
    "4": "", // ** Server Public Key
    "5": "", // ** Secret Key
    "10": 1, // Short Server ID
  },
];

/**
 * Server
 */
const server: LwM2MServer_1 = [
  {
    "0": 1, // Short Server ID
    "1": 60, // Lifetime --> During "Register" or "Update" operations, the parameter Lifetime – if present – MUST match the current value of the Mandatory Lifetime Resource of the LwM2M Server Object Instance
    "6": false, // Notification Storing When Disabled or Offline
    "7": "U", // Binding
    //8: "true",// --> commented because of an issue with Registration Update Trigger
  },
];

/**
 * Device
 */
const device: Device_3 = {
  "0": "Nordic", // Manufacturer *** used in Asset Tracker web app
  "1": "00010", // Model Number
  "2": "00000", // Serial Number *** used in Asset Tracker web app
  "3": "0.0", // Firmware Version *** used in Asset Tracker web app
  "6": 1, // Available Power Sources --> 1: Internal Battery
  "7": 0, // Power Source Voltage *** used in Asset Tracker web app
  "9": 80, // Battery Level
  "11": 0, // error code
  "16": "U", // Supported Binding and Modes
  "18": "0.0", // hardware version
  "19": "0.0", // software version
};

/**
 * Connectivity Monitoring
 */
const connectMonitoring: ConnectivityMonitoring_4 = {
  "0": 6, // Network Bearer *** used in Asset Tracker web app
  "1": 6,
  "2": -96, // Radio Signal Strength *** used in Asset Tracker web app
  "3": 0,
  "4": "10.160.225.39", // IP Addresses *** used in Asset Tracker web app
  "7": "ibasis.iot",
  "8": 21627653, // Cell ID *** used in Asset Tracker web app
  "9": 1,
  "10": 242,
  "11": 0,
  "12": 30401, // LAC = Location Area Code *** used in Asset Tracker web app
};

/**
 * Firmaware update
 */
const firmawareUpdate: FirmwareUpdate_5 = {
  "0": "1.0.0",
  "1": "",
  "3": 0,
  "5": 1,
  "9": 2,
};

/**
 * Location
 */
const location: Location_6 = {
  "0": 0, // Latitude *** used in Asset Tracker web app
  "1": 0, // Longitude *** used in Asset Tracker web app
  "2": 0, // Altitude *** used in Asset Tracker web app
  "3": 0, // Radius *** used in Asset Tracker web app
  "4": "0", // Velocity
  "5": 1665149633, // Timestamp
  "6": 0, // Speed *** used in Asset Tracker web app
};

/**
 * Temperature
 */
const temp: Temperature_3303 = [
  {
    "5518": 1665149633,
    "5601": 23.51,
    "5602": 23.51,
    "5603": -40,
    "5604": 85,
    "5700": 24.57, // Sensor Value *** used in Asset Tracker web app
    "5701": "Celsius degrees",
  },
];

/**
 * Humidity
 */
const humidity: Humidity_3304 = [
  {
    "5518": 1665149633,
    "5601": 31.06,
    "5602": 31.06,
    "5603": 0,
    "5604": 100,
    "5700": 28.93, // Sensor Value *** used in Asset Tracker web app
    "5701": "%",
  },
];

/**
 * Pressure
 */
const pressure: Pressure_3323 = [
  {
    "5518": 1665149633,
    "5601": 98.24,
    "5602": 98.24,
    "5603": 30,
    "5604": 110,
    "5700": 98.23,
    "5701": "kPa",
  },
];

/**
 * Push button
 */
const pushButton: Pushbutton_3347 = [
  {
    "5500": true,
    "5501": 0,
    "5518": 1665149633,
    "5750": "Push button 1",
  },
];

/**
 * ECID-Signal Measurement Information
 */
const signalMeasurementInfo: ECID_SignalMeasurementInformation_10256 = [
  {
    "0": 247,
    "1": 0,
    "2": 6400,
    "3": -96,
    "4": -12,
    "5": 0,
  },
];

// TODO: Location Assistance (50001) and Config are missing (50009)

// TODO: add complete list of LwM2M objects
export const assetTrackerFirmwareV2 = {
  "0": security,
  "1": server,
  "3": device,
  "4": connectMonitoring,
  "5": firmawareUpdate,
  "6": location,
  "3303": temp,
  '3304': humidity,
  '3323': pressure,
  '3347': pushButton,
  '10256': signalMeasurementInfo
};
