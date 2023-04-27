import coap from 'coap'
import { CoapRequestParams } from "coap"
import {getObjectsToRegister, serverReqParser} from './utils.js'
import config from "../config.json"
import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js"

const defaultType = "udp4"
const contentFormat = {
    'IANA-media-type': 'application/vnd.oma.lwm2m+json',
    'numericId': '11543'
}

const createAgent = () => new coap.Agent({type:defaultType})

const register = (agent: { request: (arg0: CoapRequestParams) => any }) => {

    const query = `ep=${config.deviceName} &lt=${config.lifetime} &lwm2m=${config.lwm2mV} &b=${config.biding}`

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

    
    server.on('request', (request: unknown, response: { setOption: (arg0: string, arg1: string) => void; end: (arg0: string | Buffer | undefined) => void }) => {        
        /*
        console.log('catching listening')
        console.log('request', request)
        console.log('response', response)
        */
        // response to Coiote request
        const data = responseToCoiote(request as any)
        //response.setOption('Content-Format', 'application/json');
        response.setOption('Content-Format', contentFormat["IANA-media-type"]);
        response.end(data);
    });

    server.listen(connectionPort as number, (err: unknown) => {
        console.log({err})
    })
}

const read = (url: string): string | Buffer => {
    let data = ''

    if (url === '/3') {
        // TODO: get object from LwM2MObjects.ts file
        data = JSON.stringify({
            bn: '/3',
            e: [
              { n: '0/0', sv: 'Mauro L' },
              { n: '0/1', sv: '00010' },
              { n: '0/2', sv: '00000' },
              { n: '0/3', sv: '0.0' },
              { n: '0/6', sv: '1' },
              { n: '0/9', v: 80 },
              { n: '0/16', sv: 'U' },
              { n: '0/18', sv: '0.0' },
              { n: '0/19', sv: '0.0' }
            ]
          })
    }
    return Buffer.from(data)
}

// discover what Coiote is looking for
const responseToCoiote = (req: { code: string; _packet: { confirmable: unknown }; payload: string | unknown[]; method: unknown; headers: { [x: string]: unknown; Observe: number; Accept: string }; url: string }) => {
    const optType = serverReqParser(req)
    console.log("coiote is looking for", optType, req.url)

    const url = req.url
    const slashCounter = url.split('').filter(x => x == '/').length

    // object
    if (slashCounter === 1){
        console.log('object')
    }

    let data: string | Buffer = ''

    switch (optType) {
        case 'read':
            data = read(req.url)
            break;
    
    }

    return data
}



const index = () => {
    const agent =  createAgent()
    register(agent)
}

index()

