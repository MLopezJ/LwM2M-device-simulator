// import coap from 'coap'
const coap = require('coap')  // import type generate a TypeError. TODO: solve it
import config from "../config.json"
import type { CoapRequestParams} from 'coap'
// npx ts-node ./src/index.ts

const server = coap.createServer()

server.listen(() => {
   
    const creationRequest: CoapRequestParams = {
        host: config.host,
        port: config.port,
        method: "POST",
        pathname: '/rd',
        query: 'ep=' + config.deviceName + '&lt=' + config.lifetime + '&lwm2m=' + config.lwm2mV + '&b=' + config.biding 
    }

    const req = coap.request(creationRequest)

    req.on('response', (res: { code: string; payload: object }) => {
        console.log(`Response: ${res.code} ${res.payload.toString()}`);
        console.log(res);
    })

   req.end()
})
