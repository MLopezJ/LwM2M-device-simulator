import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js";
import { read, readObject, getObjectsToRegister } from "./utils.js";

describe("getObjectsToRegister", () => {
  it("Should generate the list of the objects to be used in the register interface", () => {
    const lwM2MObjects = {
      // Security
      "0": [
        {
          "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
          "1": false, // Bootstrap-Server
          "2": 3, // Security Mode
          "3": "", // ** Public Key or Identity
          "4": "", // ** Server Public Key
          "5": "", // ** Secret Key
          "10": 1, // Short Server ID
        },
      ],

      // Server
      "1": [
        {
          "0": 1, // Short Server ID
          "1": 60, // Lifetime --> During "Register" or "Update" operations, the parameter Lifetime – if present – MUST match the current value of the Mandatory Lifetime Resource of the LwM2M Server Object Instance
          "6": false, // Notification Storing When Disabled or Offline
          "7": "U", // Binding
        },
      ],

      // Device
      "3": {
        "0": "Nordic", // Manufacturer
        "11": 0, // error code
        "16": "U", // Supported Binding and Modes
      },
    };

    const registerList = "<1/0>, <3/0>";

    expect(getObjectsToRegister(lwM2MObjects)).toBe(registerList);
  });

  it("Should not add the Security object in the register list", () => {
    const lwM2MObjects = {
      // Security
      "0": [
        {
          "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
          "1": false, // Bootstrap-Server
          "2": 3, // Security Mode
          "3": "", // ** Public Key or Identity
          "4": "", // ** Server Public Key
          "5": "", // ** Secret Key
          "10": 1, // Short Server ID
        },
      ],

      // Server
      "1": [
        {
          "0": 1, // Short Server ID
          "1": 60, // Lifetime --> During "Register" or "Update" operations, the parameter Lifetime – if present – MUST match the current value of the Mandatory Lifetime Resource of the LwM2M Server Object Instance
          "6": false, // Notification Storing When Disabled or Offline
          "7": "U", // Binding
        },
      ],
    };

    const registerList = "<1/0>";

    expect(getObjectsToRegister(lwM2MObjects)).toBe(registerList);
  });

  it("Should contain multiple instances of same object", () => {
    const lwM2MObjects = {
      // Security
      "0": [
        {
          "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
          "1": false,
          "2": 3,
          "3": "", 
          "4": "", 
          "5": "",
          "10": 1, 
        },
      ],

      // Server
      "1": [
        {
          "0": 1, 
          "1": 60,
          "6": false, 
          "7": "U",
          
        },
      ],

      // Device
      "3303": [
        {
          "5700": 24.57,
          "5701": "Celsius degrees",
        },
        {
          "5700": 20,
          "5701": "Celsius degrees",
        },
        {
          "5700": 27,
          "5701": "Celsius degrees",
        },
      ]
    };

    const registerList = "<1/0>, <3303/0>, <3303/1>, <3303/2>";

    expect(getObjectsToRegister(lwM2MObjects)).toBe(registerList);
  });
});


describe("readObject", () => {
    it("Should read current value of object and return in expected format", () => {
      
      const result: read = {
        bn: '/3',
        e: [
          { n: '0/0', sv: 'Mauro L' },
          { n: '0/1', sv: '00010' },
          { n: '0/2', sv: '00000' },
          { n: '0/3', sv: '0.0' },
          { n: '0/6', sv: '1' },
          { n: '0/9', v: 80 },
          { n: '0/16', sv: 'U' },
          { n: '0/18', sv: '0.0' },
          { n: '0/19', sv: '0.0' }
        ]
      }

      const object = readObject(assetTrackerFirmwareV2, '/3');

      expect(object).toMatchObject(result);
      expect(object).toHaveProperty('bn', '/3')
      expect(object).toHaveProperty('e')
      expect(object.e[0]).toHaveProperty('sv') // 0//
      expect(object.e[0]).not.toHaveProperty('v')// 0/0
      expect(object.e[5]).toHaveProperty('v') // 0/9
      expect(object.e[5]).not.toHaveProperty('sv')// 0/9
      
    });
  
  });