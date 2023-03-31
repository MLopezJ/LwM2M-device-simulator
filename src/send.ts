/**
 * Send LwM2M objects and values from Client to Server
 */

const coap = require('coap')
import type { CoapRequestParams} from 'coap'
import config from "../config.json"

const creationRequest: CoapRequestParams = {
    host: config.host,
    port: 5683,
    method: "POST",
    pathname: '/dp',
    query: 'ep=' + config.deviceName + "&content" + "application/senml+json" 
}

const req = coap.request(creationRequest)

const payload = [
    {"n":"/6/0/0", "v":43.61092},
    {"n":"/6/0/1", "v":3.87723}
]

req.write(payload, () =>{
    console.log("Payload sent: ", payload)
})

req.on('response', (res: any) => {
    console.log('Server response with: ' + res.code);
    console.log(res)
    //res.pipe(process.stdout)
})

req.end()