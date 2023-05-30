import { assetTrackerFirmwareV2, type assetTracker } from "../assetTrackerV2.js";
import { getValue } from "./getValue.js";
import {
  Device_3_urn,
  Temperature_3303_urn,
} from "@nordicsemiconductor/lwm2m-types";


describe("getValue", () => {
  it("Should return object", () => {
    expect(
      getValue(
        { objectId: 3, instanceId: -1, resourceId: -1 },
        "object",
        assetTrackerFirmwareV2
      )
    ).toMatchObject(assetTrackerFirmwareV2[Device_3_urn]!);
  });

  it("Should return undefined if object does not exist", () => {
    expect(
      getValue(
        { objectId: 315, instanceId: -1, resourceId: -1 },
        "object",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return instance (single instance object)", () => {
    expect(
      getValue(
        { objectId: 3, instanceId: 0, resourceId: -1 },
        "instance",
        assetTrackerFirmwareV2
      )
    ).toMatchObject(assetTrackerFirmwareV2[Device_3_urn]!);
  });

  it("Should return undefined when instance does not exist (single instance object)", () => {
    expect(
      getValue(
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
      getValue(
        { objectId: 3303, instanceId: 1, resourceId: -1 },
        "instance",
        objectList
      )
    ).toMatchObject(newTemp);
  });

  it("Should return undefined when instance does not exist (multiple instance object)", () => {
    expect(
      getValue(
        { objectId: 3303, instanceId: 10, resourceId: -1 },
        "instance",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return resource (single instance object)", () => {
    expect(
      getValue(
        { objectId: 3, instanceId: 0, resourceId: 0 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe("Nordic");
  });

  it("Should return undefined when resource does not exist (single instance object)", () => {
    expect(
      getValue(
        { objectId: 3, instanceId: 0, resourceId: 10101010 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });

  it("Should return resource (multiple instance object)", () => {
    expect(
      getValue(
        { objectId: 3303, instanceId: 0, resourceId: 5700 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe(24.57);
  });

  it("Should return undefined when resource does not exist (single instance object)", () => {
    expect(
      getValue(
        { objectId: 3303, instanceId: 0, resourceId: 10101010 },
        "resource",
        assetTrackerFirmwareV2
      )
    ).toBe(undefined);
  });
});