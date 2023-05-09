import { assetTrackerFirmwareV2, type assetTracker } from "./assetTrackerV2.js";
import { type e, getResourceList, getObjectsToRegister, getURN, getElementType, getElementPath, getElementValue } from "./utils.js";
import {
  Device_3_urn,
  ConnectivityMonitoring_4_urn,
  Temperature_3303_urn,
  ECID_SignalMeasurementInformation_10256_urn,
  LwM2MServer_1_urn,
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


describe('getURN', () =>{
  it('Should return the object URN given the URL', () => {
    expect(getURN('/3')).toBe(Device_3_urn)
    expect(getURN('/10256')).toBe(ECID_SignalMeasurementInformation_10256_urn)
    expect(getURN('/3303')).toBe(Temperature_3303_urn)
    expect(getURN('/4')).toBe(ConnectivityMonitoring_4_urn)
    expect(getURN('/1')).toBe(LwM2MServer_1_urn)
  })

  it('Should return undefined if object is not found by the given URL', () => {
    expect(getURN('/40404')).toBe(undefined)
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

      const resourceList = getResourceList(multipleInstance, 'object'); // TODO test with {}
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

      const resourceList = getResourceList(singleInstance, 'object');
      expect(resourceList).toMatchObject(result);
    });

    it("Should generate resource list from empty single instance object", () => {
      const singleInstance = {}
      const resourceList = getResourceList(singleInstance, 'object');
      expect(resourceList.length).toBe(0)
    });

    it("Should generate resource list from empty multiple instance object", () => {
      const multipleInstance = [{}]
      const resourceList = getResourceList(multipleInstance, 'object');
      expect(resourceList.length).toBe(0)
    });

    it("Should generate resource list from Instance id", () => {
       const resourceList = getResourceList(assetTrackerFirmwareV2[Device_3_urn]!, 'instance');
       const result: e[] = [
        { n: '0', sv: 'Nordic' },
        { n: '1', sv: '00010' },
        { n: '2', sv: '00000' },
        { n: '3', sv: '0.0' },
        { n: '6', v: 1 },
        { n: '7', v: 0 },
        { n: '9', v: 80 },
        { n: '11', v: 0 },
        { n: '16', sv: 'U' },
        { n: '18', sv: '0.0' },
        { n: '19', sv: '0.0' }
      ]
      expect(resourceList).toMatchObject(result);
    })

    it("Should generate resource list from rersource id", () => {
      const list = getResourceList(assetTrackerFirmwareV2[Device_3_urn]!, 'resource', {objectId: 3, instanceId:0, resourceId: 0});
      const result: e[] = [
       {sv: 'Nordic' }
     ]
     expect(list).toMatchObject(result);
   })

   it("Should generate value list from rersource id (multiple instance)", () => {
    const list = getResourceList(assetTrackerFirmwareV2[Temperature_3303_urn]!, 'resource', {objectId: 3303, instanceId:0, resourceId: 5700});
    const result: e[] = [
     {v: 24.57 }
   ]
   expect(list).toMatchObject(result);
 })
  
  });

describe('getElementType', () =>{
  it('Should detect object as the element type', () => {
    expect(getElementType('/3')).toBe('object')
  })

  it('Should detect instance as the element type', () => {
    expect(getElementType('/3/0')).toBe('instance')
  })

  it('Should detect resource as the element type', () => {
    expect(getElementType('/3/0/1')).toBe('resource')
  })

  it.each(['', '/3/0/1/0', '/3/0/1/0/1/1/1'])('Should return undefined when format is not recognized in value sent by parameter: %p', (element: string) => {
    expect(getElementType(element)).toBe(undefined)
  })
})

describe('getElementPath', () =>{
  it.each([
    ['/3/0/1', {objectId: 3, instanceId: 0 ,resourceId: 1}],
    ['/3303/10/5700', {objectId: 3303, instanceId: 10 ,resourceId: 5700}],
  ])
  ('Should split path in different ids: %p', (path: string, obj: object) => {
    expect(getElementPath(path)).toMatchObject(obj)
  })

  it('Should return ids with -1 if there is an issue on its transformation', () => {
    expect(getElementPath('')).toMatchObject({objectId: -1, instanceId: -1 ,resourceId: -1})
  })
})

describe("getElementValue", () => {
  it("Should return object", () => {
    expect(
      getElementValue(
        { objectId: 3, instanceId: -1, resourceId: -1 },
        "object",
        assetTrackerFirmwareV2
      )
    ).toMatchObject(assetTrackerFirmwareV2[Device_3_urn]!);
  });

  it("Should return undefined if object does not exist", () => {
    expect(
      getElementValue(
        { objectId: 315, instanceId: -1, resourceId: -1 },
        "object",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return instance (single instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3, instanceId: 0, resourceId: -1 },
        "instance",
        assetTrackerFirmwareV2
      )
    ).toMatchObject(assetTrackerFirmwareV2[Device_3_urn]!);
  });

  it("Should return undefined when instance does not exist (single instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3, instanceId: 10, resourceId: -1 },
        "instance",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return instance (multiple instance object)", () => {
    const objectList: any = assetTrackerFirmwareV2 // this any is intentional
    const newTemp = {
      "5518": 1665149633,
      "5601": 23.51,
      "5602": 23.51,
      "5603": -40,
      "5604": 85,
      "5700": 10,
      "5701": "Celsius degrees",
    }
    objectList[Temperature_3303_urn as keyof assetTracker] = [...assetTrackerFirmwareV2[Temperature_3303_urn]!, newTemp]
    expect(
      getElementValue(
        { objectId: 3303, instanceId: 1, resourceId: -1 },
        "instance",
        objectList
      )
    ).toMatchObject(newTemp);
  });

  it("Should return undefined when instance does not exist (multiple instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3303, instanceId: 10, resourceId: -1 },
        "instance",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return resource (single instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3, instanceId: 0, resourceId: 0 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe("Nordic");
  });

  it("Should return undefined when resource does not exist (single instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3, instanceId: 0, resourceId: 10101010 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return resource (multiple instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3303, instanceId: 0, resourceId: 5700 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe(24.57);
  });

  it("Should return undefined when resource does not exist (single instance object)", () => {
    expect(
      getElementValue(
        { objectId: 3303, instanceId: 0, resourceId: 10101010 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });
});