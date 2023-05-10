import type { LwM2MDocument } from "@nordicsemiconductor/lwm2m-types";
import coap, { type Agent, type CoapRequestParams } from "coap";
import config from "../../config.json";
import type { assetTracker } from "../assetTrackerV2.js";
import {
  getElementPath,
  getElementType,
  getObjectsToRegister,
  getResourceList,
  getURN,
  serverReqParser,
  type e,
} from "../utils.js";
import { objectList } from "..";

const contentFormat = {
  "IANA-media-type": "application/vnd.oma.lwm2m+json",
  numericId: "11543",
};

/**
 * Register device to Coiote
 */
export const register = (objectList: assetTracker, agent: Agent) => {

  //const defaultType = "udp4"
  //const agent = new coap.Agent({type:defaultType})

  const query = `ep=${config.deviceName}&lt=${config.lifetime}&lwm2m=${config.lwm2mV}&b=${config.biding}`;
  const registrationString = getObjectsToRegister(objectList);
  const payload = `</>;ct=${contentFormat.numericId};hb,${registrationString}`;

  const params: CoapRequestParams = {
    host: "eu.iot.avsystem.cloud",
    port: 5683,
    pathname: "/rd",
    method: "POST",
    options: { "Content-Format": "application/link-format" },
    query,
  };

  const registerRequest = agent.request(params);

  registerRequest.on(
    "response",
    (response: {
      code: string;
      rsinfo: { address: unknown; port: unknown };
      headers: { [x: string]: string };
      outSocket: { address: unknown; port: string | number };
    }) => {
      //console.log("register response: ", response);

      if (response.code === "2.01") {
        const coiote = {
          ip: response.outSocket.address,
          port: response.outSocket.port,
          locationPath: `/rd/${response.headers["Location-Path"]}`,
        };

        /**
         * The Device Simulator just sent a request to Coiote for register itself.
         *
         * Now, a server should be open to hear from Coiote and see what else is needed.
         */
        listenToCoiote(coiote.port);
      }
    }
  );

  registerRequest.on("error", (err: any) => {
    console.log({ err });
  });

  registerRequest.end(payload);
};

/**
 * Open a new server to hear requests from Coiote
 */
const listenToCoiote = (connectionPort: number | string) => {
  console.log("LISTENING TO COIOTE on port: ", connectionPort);
  const defaultType = "udp4";
  const server = coap.createServer({
    type: defaultType,
    proxy: true,
  });

  server.on(
    "request",
    (
      request: { url: string },
      response: {
        setOption: (arg0: string, arg1: string) => void;
        end: (arg0: string | Buffer | undefined) => void;
      }
    ) => {
      const action = serverReqParser(request as any); // TODO: improve this
      console.log("coiote is looking for", action, request.url);
      const data = createPayload(action, request.url);

      response.setOption("Content-Format", contentFormat["IANA-media-type"]);
      response.end(data);
    }
  );

  server.listen(connectionPort as number, (err: unknown) => {
    console.log({ err });
  });
};

/**
 * Generate payload depending on option type requested
 */
export const createPayload = (action: string, url: string): Buffer => {
  let data: Buffer = Buffer.from("");
  switch (action) {
    case "read":
      data = getObject(url, objectList!);
      break;
  }
  return data;
};

export type lwm2mJson = {
  bn: string;
  e: e[];
};

/**
 * Read data from object and transform to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const getObject = (url: string, objectList: assetTracker): Buffer => {
  const urn = getURN(url);
  if (Boolean(urn) === false)
    return Buffer.from(JSON.stringify({ bn: null, e: null }));

  const object = objectList[`${urn}` as keyof LwM2MDocument];
  const elementType = getElementType(url);
  let elementPath = undefined;

  if (elementType === "resource") elementPath = getElementPath(url);

  const valueList =
    elementType !== undefined
      ? getResourceList(object ?? {}, elementType, elementPath)
      : [];
  const data: lwm2mJson = {
    bn: url,
    e: valueList,
  };

  return Buffer.from(JSON.stringify(data));
};
