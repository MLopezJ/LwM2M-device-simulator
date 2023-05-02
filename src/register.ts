import coap from 'coap'
import { CoapRequestParams } from "coap"
import {e, getObjectsToRegister, getResourceList, getURN, serverReqParser} from './utils.js'
import config from "../config.json"
import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js"
import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'

const defaultType = "udp4"
const contentFormat = {
    'IANA-media-type': 'application/vnd.oma.lwm2m+json',
    'numericId': '11543'
}

const createAgent = () => new coap.Agent({type:defaultType})

const register = (agent: { request: (arg0: CoapRequestParams) => any }) => {

    const query = `ep=${config.deviceName}&lt=${config.lifetime}&lwm2m=${config.lwm2mV}&b=${config.biding}`

    const registrationString = getObjectsToRegister(assetTrackerFirmwareV2)
    const payload = `</>;ct=${contentFormat.numericId};hb,${registrationString}`

    const params: CoapRequestParams = {
        host: "eu.iot.avsystem.cloud",
        port: 5683,
        pathname: '/rd',
        method: "POST",
        options: {'Content-Format': 'application/link-format'},
        query
    }

    const registerRequest = agent.request(params);

    registerRequest.on('response', (response: { code: string; rsinfo: { address: unknown; port: unknown }; headers: { [x: string]: string }; outSocket: { address: unknown; port: string | number } }) => {
        console.log('register response: ', response)

        if (response.code === "2.01"){

            const coiote = {
                ip: response.outSocket.address,
                port: response.outSocket.port,
                locationPath: `/rd/${response.headers['Location-Path']}`
            }

            listenToCoiote(coiote.port)
        }
    });

    registerRequest.on('error', (err: any) => {
        console.log({err})
    });

    registerRequest.end(payload);

    //registerRequest.write(payload)
}

const listenToCoiote = (connectionPort: number | string) => {
    console.log("LISTENING TO COIOTE on port: ", connectionPort)
    
    const server = coap.createServer({
        type:defaultType,
        proxy: true
    });

    
    server.on('request', (request: {url: string}, response: { setOption: (arg0: string, arg1: string) => void; end: (arg0: string | Buffer | undefined) => void }) => {        
        
        const optType = serverReqParser(request as any) // TODO: improve this
        console.log("coiote is looking for", optType, request.url)
        const data = responseToCoiote(optType, request.url)
        
        response.setOption('Content-Format', contentFormat["IANA-media-type"]);
        response.end(data);
    });

    server.listen(connectionPort as number, (err: unknown) => {
        console.log({err})
    })
}

export type lwm2mJson = {
    bn: string
    e: e[]
  };

/**
 * Read data from resource and transform to vnd.oma.lwm2m+json format
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_0-20170208-A/OMA-TS-LightweightM2M-V1_0-20170208-A.pdf pag 55
 */
export const read = (url: string): Buffer => {
    const urn = getURN(url, assetTrackerFirmwareV2)
    if (Boolean(urn) === false) return Buffer.from(JSON.stringify({bn:null, e: null}))

    const object = assetTrackerFirmwareV2[`${urn}` as keyof LwM2MDocument]
    const resourceList = getResourceList(object??{})
    const data: lwm2mJson = {
        bn: url,
        e: resourceList
    }
    return Buffer.from(JSON.stringify(data))
}

/**
 * Generate payload depending on option type requested
 */
export const responseToCoiote = (optionType: string, url: string): Buffer => {
    let data: Buffer = Buffer.from('')
    switch (optionType) {
        case 'read':
            data = read(url)
            break;
    }
    return data
}

export const index = () => {
    const agent =  createAgent()
    register(agent)
}
