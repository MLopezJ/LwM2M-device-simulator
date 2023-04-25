/**
 * LwM2M objects to be used
 */

/**
 * Security
 */
const security = {
    '0':{
        '0': {
            '0': "coap://eu.iot.avsystem.cloud:5683" , // LWM2M  Server URI  - Coiote
            '1': false, // Bootstrap-Server
            '2': 3, // Security Mode
            '3': "",// ** Public Key or Identity
            '4': "",// ** Server Public Key
            '5': "",// ** Secret Key
            '10': 1 // Short Server ID
        }
    }
}

/**
 * Server
 */
const serverr = {
    '1':{
        '0': {
            '0': 1, // Short Server ID
            '1': 60, // Lifetime --> During "Register" or "Update" operations, the parameter Lifetime – if present – MUST match the current value of the Mandatory Lifetime Resource of the LwM2M Server Object Instance
            '6': false, // Notification Storing When Disabled or Offline
            '7': "U",// Binding
            //8: "true",// --> commented because of an issue with Registration Update Trigger
        }
    }
}

/**
 * Device
 */
const device = {
    '3':{
        '0': {
            '0': "Nordic", // Manufacturer
            '1': "00010", // Model Number
            '2': "00000", // Serial Number
            '3': "0.0",// Firmware Version
            // 4: false, // --> commented because of an issue with Reboot
            '6': "1", // Available Power Sources --> 1: Internal Battery
            '9': 80 , // Battery Level
            '16': "U", // Supported Binding and Modes
            '18': "0.0", // hardware version
            '19': "0.0" // software version
        }
    }
}


/**
 * Temperature
 */
const temp = {
    '3303':{
        '0': {
          '5700': 21, // Sensor Value
          '5701': 'C'
        }
    }
}

// TODO: add complete list of LwM2M objects
export const assetTracker = {
    '0':security['0'],
    '1':serverr['1'],
    '3': device['3'],
    '3303':temp['3303']
}