/**
 * Client
 */

const coap = require('coap')
import type { CoapRequestParams} from 'coap'
import config from "../../config.json"

const creationRequest: CoapRequestParams = {
    host: 'localhost',
    port: 5683,
    method: "POST",
    pathname: '/rd',
    query: 'ep=' + config.deviceName + '&lt=' + config.lifetime + '&lwm2m=' + config.lwm2mV + '&b=' + config.biding 
}
const req = coap.request(creationRequest)

const payload = "</3/0>, </6/0>"
req.write(payload)

req.on('response', (res: any) => {
    res.pipe(process.stdout)
})

req.end()