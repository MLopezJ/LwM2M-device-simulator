import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js";
import { e, getResourceList, getObjectsToRegister, getURN } from "./utils.js";
import {
  Device_3_urn,
  ConnectivityMonitoring_4_urn,
  Temperature_3303_urn,
  ECID_SignalMeasurementInformation_10256_urn,
} from "@nordicsemiconductor/lwm2m-types";

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


describe('', () =>{
  it('Should return the object URN given the URL', () => {
    expect(getURN('/3', assetTrackerFirmwareV2)).toBe(Device_3_urn)
    expect(getURN('/10256', assetTrackerFirmwareV2)).toBe(ECID_SignalMeasurementInformation_10256_urn)
    expect(getURN('/3303', assetTrackerFirmwareV2)).toBe(Temperature_3303_urn)
    expect(getURN('/4', assetTrackerFirmwareV2)).toBe(ConnectivityMonitoring_4_urn)
  })
})

describe("getResourceList", () => {
    it("Should generate resource list from multiple instance object", () => {
      
      const multipleInstance = [
        { '5700': 24.57, '5701': 'Celsius degrees' },
        { '5700': 20, '5701': 'Celsius degrees' },
        { '5700': 27, '5701': 'Celsius degrees' }
      ]
  
      const result: e[] = [
        { n: '0/5700', v: 24.57 },
        { n: '0/5701', sv: 'Celsius degrees' },
        { n: '1/5700', v: 20 },
        { n: '1/5701', sv: 'Celsius degrees' },
        { n: '2/5700', v: 27 },
        { n: '2/5701', sv: 'Celsius degrees' }
      ]

      const resourceList = getResourceList(multipleInstance); // TODO test with {}
      expect(resourceList).toMatchObject(result);
      expect(resourceList[0]).toHaveProperty('n', '0/5700') 
      expect(resourceList[0]).toHaveProperty('v', 24.57)
      expect(resourceList[5]).toHaveProperty('n', '2/5701') // '0/5700'
      expect(resourceList[5]).toHaveProperty('sv', 'Celsius degrees') // '0/5700'

    });

    it("Should generate resource list from single instance object", () => {
      
      const singleInstance = {
        "0": "Nordic",
        "1": "00010",
        "2": "00000", 
        "3": "0.0",
        "6": 1,
        "7": 0, 
        "9": 80, 
        "11": 0, 
        "16": "U",
        "18": "0.0",
        "19": "0.0", 
      }
  
      const result: e[] = [
        { n: '0/0', sv: 'Nordic' },
        { n: '0/1', sv: '00010' },
        { n: '0/2', sv: '00000' },
        { n: '0/3', sv: '0.0' },
        { n: '0/6', v: 1 },
        { n: '0/7', v: 0 },
        { n: '0/9', v: 80 },
        { n: '0/11', v: 0 },
        { n: '0/16', sv: 'U' },
        { n: '0/18', sv: '0.0' },
        { n: '0/19', sv: '0.0' }
      ]

      const resourceList = getResourceList(singleInstance);
      expect(resourceList).toMatchObject(result);
    });

    it("Should generate resource list from empty single instance object", () => {
      const singleInstance = {}
      const resourceList = getResourceList(singleInstance);
      console.log(resourceList)
      expect(resourceList.length).toBe(0)
    });

    it("Should generate resource list from empty multiple instance object", () => {
      const multipleInstance = [{}]
      const resourceList = getResourceList(multipleInstance);
      console.log(resourceList)
      expect(resourceList.length).toBe(0)
    });
  
  });