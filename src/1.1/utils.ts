// TODO: add description
export const serverReqParser = (req: {
  code: string;
  _packet: { confirmable: unknown };
  payload: string | unknown[];
  method: unknown;
  headers: { [x: string]: unknown; Observe: number; Accept: string };
  url: string;
}): string => {
  let optType;

  if (
    req.code === "0.00" &&
    req._packet.confirmable &&
    req.payload.length === 0
  ) {
    optType = "empty";
  } else {
    switch (req.method) {
      case "GET":
        if (req.headers.Observe === 0) optType = "observe";
        else if (req.headers.Observe === 1) optType = "cancelObserve";
        else if (req.headers.Accept === "application/link-format")
          optType = "discover";
        else optType = "read";
        break;
      case "PUT":
        if (req.headers["Content-Format"]) optType = "write";
        else optType = "writeAttr";
        break;
      case "POST":
        if (req.url === "/ping") optType = "ping";
        else if (req.url === "/bs") optType = "finish";
        else if (req.url === "/announce") optType = "announce";
        else if (req.headers["Content-Format"]) optType = "create";
        else optType = "execute";
        break;
      case "DELETE":
        optType = "delete";
        break;
      default:
        optType = "empty";
        break;
    }
  }

  return optType;
};

/**
 * Generate the list of LwM2M objects that are goint to be send in the registration interface
 * example: <LwM2M Object id/ instance id>, <LwM2M Object id/ instance id>
 */
export const getObjectsToRegister = (LwM2MObjects: {}): string => {
  const registerObject = Object.entries(LwM2MObjects).reduce(
    (previus: string, current: any) => {
      const objectId = current[0];

      if (objectId === "0") return previus;

      const objectString = `<${objectId}`;
      const instances = Object.keys(current[1] as {});
      const value = instances.reduce((prev, instanceId) => {
        //              < object id  / instance id >
        const struct = `${objectString}/${instanceId}>`;
        return prev !== "" ? `${prev}, ${struct}` : struct;
      }, "");

      return previus !== "" ? `${previus}, ${value}` : value;
    },
    ""
  );

  return registerObject;
};


/*

const objectId = object[0];
    const instances = Object.keys(object[1] as {});


if (objectId !== "0") {
      const objectString = `<${objectId}`;
      return instances.reduce((previus, instanceId) => {
        //              < object id  / instance id >
        const struct = `${objectString}/ ${instanceId}>`;
        return previus !== "" ? `${previus}, ${struct}` : struct;
      }, "");
    }
*/