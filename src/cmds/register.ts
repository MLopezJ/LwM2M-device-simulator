import type { LwM2MDocument } from "@nordicsemiconductor/lwm2m-types";
import coap, { OutgoingMessage, type CoapRequestParams } from "coap"; // type Agent,
import config from "../../config.json";
import { type assetTracker } from "../assetTrackerV2.js";
import { getURN } from "./registerUtils.js";
import { getBracketFormat } from "../utils/getBracketFormat";
import { requestParser } from "../utils/requestParser";
import { typeOfElement } from "../utils/typeOfElement";
import { getElementPath } from "../utils/getElementPath";
import { createE, type e } from "../utils/createE";

type registrationResponse = {
  code: string;
  rsinfo: { address: unknown; port: unknown };
  headers: { [x: string]: string };
  outSocket: { address: unknown; port: string | number };
}

const udpDefault = "udp4"
let assetTrackerObjects:  undefined | assetTracker = undefined

/**
 * Index
 */
export const register = (objectList: assetTracker) => {
  assetTrackerObjects = objectList
  /**
   * Data Format id for Transferring Resource Information as a json
   * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
   */
  const jsonId = "11543";
  const objects = getBracketFormat(objectList);
  const payload = `</>;ct=${jsonId};hb,${objects}`;

  const registerRequest = registration()

  registerRequest.end(payload);

  registerRequest.on("error", (err: any) => {
    console.log({ err });
  });

  registerRequest.on(
    "response",
    (response: registrationResponse) => manageResponse(response)
  );
}

/**
 * Send registration request to server
 */
const registration = (): OutgoingMessage => {
  const registerQuery = `ep=${config.deviceName}&lt=${config.lifetime}&lwm2m=${config.lwm2mV}&b=${config.biding}`;

  const params: CoapRequestParams = {
    host: config.host,
    port: config.port,
    pathname: "/rd",
    method: "POST",
    options: { "Content-Format": "application/link-format" },
    query: registerQuery,
  };

  const agent = new coap.Agent({type:udpDefault})
  const registerRequest = agent.request(params);

  return registerRequest
}

type serverRequest = { url: string }
type serverRespose = {
  setOption: (arg0: string, arg1: string) => void;
  end: (arg0: string | Buffer | undefined) => void;
}

/**
 * Stablish a socket connection in case the response is sucess
 */
const manageResponse = (response: registrationResponse) => {
  // if registration sucess
  if (response.code === "2.01") {
    const socketPort = response.outSocket.port // socket port of connection between Coiote and Device Simulator

    // Create a new server to interact with Coiote
    const server = coap.createServer({
      type: udpDefault,
      proxy: true,
    });

    server.listen(socketPort as number, (err: unknown) => {
      console.log({ err });
    });

    server.on(
      "request",
      (
        request: serverRequest,
        response: serverRespose
      ) => manageCoioteRequest(request, response)
    );
  }
}

/**
 * Identify the action requested and create payload to response
 */
const manageCoioteRequest = (request: serverRequest, response: serverRespose, objectList: assetTracker | undefined = assetTrackerObjects) => {
  const actionRequested = requestParser(request as any); // TODO: improve this
  console.log("Coiote request ",actionRequested," element ", request.url)

  let payload = undefined
  if (objectList !== undefined){
    payload = getPayload(actionRequested, request.url, objectList)
  } else {
    console.log('List with objects is undefined')
  }

  /**
   * Json as IANA Media Type 
   * @see http://www.openmobilealliance.org/release/LightweightM2M/V1_0_2-20180209-A/OMA-TS-LightweightM2M-V1_0_2-20180209-A.pdf Page 48
   */
  const json = "application/vnd.oma.lwm2m+json";

  response.setOption("Content-Format", json);
  response.end(payload);
}

/**
 * Generate payload depending on option type requested
 */
export const getPayload = (action: string, url: string,  objectList: assetTracker): Buffer => {
  let data: Buffer = Buffer.from("");
  switch (action) {
    case "read":
      data = getObject(url, objectList);
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
  const elementType = typeOfElement(url);
  let elementPath = undefined;

  if (elementType === "resource") elementPath = getElementPath(url);

  const e =
    elementType !== undefined
      ? createE(object ?? {}, elementType, elementPath)
      : [];
  const data: lwm2mJson = {
    bn: url,
    e: e,
  };

  return Buffer.from(JSON.stringify(data));
};
