import type { LwM2MDocument } from "@nordicsemiconductor/lwm2m-types";
import { correlationTable } from "../assetTrackerV2";
import type { assetTracker } from "../assetTrackerV2.js";

// TODO: update assetTrackerFirmwareV2 with param

/**
 * Set new value in LwM2M object list
 * TODO: add unit test
 * TODO: make sure there is not site effect on assetTrackerFirmwareV2
 */
export const set = (
  objectList: assetTracker,
  path: {
    objectId: number;
    instanceId: number;
    resourceId: number;
  },
  value: string
): assetTracker | undefined => {
  //const path = getElementPath(command[0]??'')
  //const value = command[1]
  //const objectURI: keyof LwM2MDocument | undefined = correlationTable[`${path.objectId}`] as keyof LwM2MDocument ?? undefined
  const objectURI: keyof LwM2MDocument = correlationTable[
    `${path.objectId}`
  ] as keyof LwM2MDocument;
  if (objectURI === undefined) {
    console.log(
      `\nError: Object ${path.objectId} do not exist in object list \n--------------------------------\n`
    );
    return;
  }

  // LwM2M object
  const element = objectList[`${objectURI}`];

  // This condition is repeated but been added because object could be undefined just because of the typescript rules
  if (element === undefined) {
    console.log(
      `\nError: Object ${path.objectId} do not exist in object list \n--------------------------------\n`
    );
    return;
  }

  const isSingleInstance = !Array.isArray(element);

  if (isSingleInstance) {
    if (path.instanceId !== 0) {
      console.log(
        `\nError: Object ${path.objectId} is single instance. \n--------------------------------\n`
      );
      return;
    }

    // TODO Solve this typescript issue
    // set value
    // @ts-ignore
    objectList![`${objectURI}`]![`${path.resourceId}`]! = value;
    return objectList
  } else {
    // multiple instance case
    if (element.length - 1 < path.instanceId) {
      console.log(
        `\nError: Instance ${path.instanceId} of object ${path.objectId} do not exist on list. \n--------------------------------\n`
      );
      return;
    }

    const resourceOptions = element[`${path.instanceId}`];

    if (resourceOptions[`${path.resourceId}`] === undefined) {
      console.log(
        `\nError: Resource ${path.resourceId} do not exist on ${path.objectId}/${path.instanceId}. \n--------------------------------\n`
      );
      return;
    }

    // TODO Solve this typescript issue
    // set value
    // @ts-ignore
    objectList[`${objectURI}`]![path.instanceId]![
      `${path.resourceId}`
    ] = value;
    return objectList
  }
};
