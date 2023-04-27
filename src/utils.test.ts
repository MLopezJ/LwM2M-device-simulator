import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js";
import { read, readObject, getObjectsToRegister } from "./utils.js";

describe("getObjectsToRegister", () => {
  it("Should generate the list of the objects to be used in the register interface", () => {
    // TODO: update object struct
    const lwM2MObjects = {
      // Security
      "0": {
        "0": {
          "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
          // ...
        },
      },

      // Server
      "1": {
        "0": {
          "0": 1, // Short Server ID
          // ...
        },
      },

      // Device
      "3": {
        "0": {
          "0": "Nordic", // Manufacturer
          // ...
        },
      },
    };

    const registerList = "<1/0>, <3/0>";

    expect(getObjectsToRegister(lwM2MObjects)).toBe(registerList);
  });

  it("Should not add the Security object in the register list", () => {
    const lwM2MObjects = {
      // Security
      "0": {
        "0": {
          "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
          // ...
        },
      },

      // Server
      "1": {
        "0": {
          "0": 1, // Short Server ID
          // ...
        },
      },
    };

    const registerList = "<1/0>";

    expect(getObjectsToRegister(lwM2MObjects)).toBe(registerList);
  });

  it("Should contain multiple instances of same object", () => {
    const lwM2MObjects = {
      // Security
      "0": {
        "0": {
          "0": "coap://eu.iot.avsystem.cloud:5683", // LWM2M  Server URI  - Coiote
          // ...
        },
      },

      // Server
      "1": {
        "0": {
          "0": 1, // Short Server ID
          // ...
        },
      },

      // Temperature
      "3303": {
        "0": {
          "5700": 21, // Sensor Value
          "5701": "C",
        },
        "1": {
          "5700": 21, // Sensor Value
          "5701": "C",
        },
        "2": {
          "5700": 21, // Sensor Value
          "5701": "C",
        },
      },
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