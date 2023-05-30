import { assetTrackerFirmwareV2 } from "../assetTrackerV2.js"
import { getBracketFormat } from "./getBracketFormat.js"

describe("getBracketFormat", () => {
    it("Should transform Asset Tracker into string bracket format", () => {
        expect(getBracketFormat(assetTrackerFirmwareV2)).toBe("<6/0>, <10256/0>, <1/0>, <3/0>, <4/0>, <5/0>, <3303/0>, <3304/0>, <3323/0>, <3347/0>")
    })

    it("Should not add the Security object in the result", () => {
        const lwM2MObjects = {
          // Security
          "0": [
            {
              "0": "coap://eu.iot.avsystem.cloud:5683",
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
        };
    
        expect(getBracketFormat(lwM2MObjects)).toBe("<1/0>");
      });

      it("Should transform multiple instances of same object", () => {
        const lwM2MObjects = {
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
    
        const registerList = "<3303/0>, <3303/1>, <3303/2>";
        // set any to ignore ts warnig, becuase the context is controlled. 
        expect(getBracketFormat(lwM2MObjects as any)).toBe(registerList);
      });
})