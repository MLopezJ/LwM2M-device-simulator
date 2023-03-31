/**
 * Registrate Device
 */

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

    const assetTrackerObjects = "</3/0>, <50009/0>, <3303/0>, <3304/0>, <3323/0>, </6/0>, </4/0>"

    req.write(assetTrackerObjects, () =>{
        console.log("Payload sent: ", assetTrackerObjects)
    })

    req.on('response', (res: { code: string; payload: object }) => {
        console.log('Server response with: ' + res.code);
        console.log(res)
        //res.pipe(process.stdout)
    })

   req.end()
})
