/**
 * Server
 */

const coap = require('coap') 
const server = coap.createServer()

server.on('request', (req: any, res: any) => {
    //console.log(req)
    console.log(req._packet.payload.toString())
    res.end('Message:' + req.payload + '\n')
})

server.listen(() => {
    console.log('server started')
})