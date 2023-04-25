import { registrationObject } from "./utils";

//console.log(registrationObject);

describe("registrationObject", () => {
  it("Should generate the list of the objects to be used in the register interface", () => {
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

    expect(registrationObject(lwM2MObjects)).toBe(registerList);
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

    expect(registrationObject(lwM2MObjects)).toBe(registerList);
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

    expect(registrationObject(lwM2MObjects)).toBe(registerList);
  });
});
