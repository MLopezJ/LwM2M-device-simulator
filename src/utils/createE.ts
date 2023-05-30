import type { element } from "./getElementPath";
import type { elementType } from "./typeOfElement";

/**
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 57, last example
 */
type value = {
  n?: string
};

type stringValue = {
  sv: string
  v?: never
} & value;

type numericValue = {
  sv?: never
  v: number
} & value;

export type e = stringValue | numericValue | Record<string, never>;

/**
 * Transform imput into variable 'e' of the application/vnd.oma.lwm2m+json format.
 * 
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 *
 */
export const createE = (
  values: object[] | object,
  typeOfElement: elementType,
  resourcePath?: element
): e[] => {
  if (typeOfElement === "resource" && resourcePath !== undefined) {
    const value = Array.isArray(values)
      ? values[resourcePath.instanceId]
      : values;
    const resourceElement: string | number =
      value[`${resourcePath.resourceId}`];
    const key = typeof resourceElement === "string" ? "sv" : "v";

    return [{ [key]: resourceElement }] as e[];
  }

  const createList = (obj: object, index: number) => {
    return Object.entries(obj).reduce(
      (previus: object[], current: [string, string | number]) => {
        const value = typeof current[1] === "string" ? "sv" : "v";
        let result = {};

        switch(typeOfElement){
            case "object":
                result = { n: `${index}/${current[0]}`, [value]: current[1] };
                break
            case "instance":
                result = { n: `${current[0]}`, [value]: current[1] };
                break
            case "resource":
                result = { [value]: current[1] };
                break
        }

        previus.push(result);
        return previus;
      },
      []
    );
  };

  let e = [{}];
  if (Array.isArray(values)) {
    e = values
      .map((element: object, index: number) => {
        return createList(element, index);
      })
      .flat();
    return e;
  } else {
    return createList(values, 0) as e[];
  }
};
