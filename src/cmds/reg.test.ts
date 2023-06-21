import coap, { createServer, request, Server } from 'coap'
import { handShake } from "./reg"
import { type CoapMethod } from 'coap-packet'

describe("handshake", () => {
    let server: Server
    let port: number

    beforeEach(function (done) {
        port = 5683
        server = createServer()
        server.listen(port, done)
    })


    it('should receive a request at a path with some query', function (done) {
        request(`coap://localhost:${port}/abcd/ef/gh/?foo=bar&beep=bop`).end()
        server.on('request', (req) => {
            expect(req.url).toBe('/abcd/ef/gh?foo=bar&beep=bop')
            setImmediate(done)
        })
    })

    it('should receive a request at a path with some query async', async () => {

        const params = {
            host: 'localhost',
            port: 5683,
            pathname: '/rd',
            method: 'POST' as CoapMethod,
            options: { 'Content-Format': 'application/link-format' },
            query: 'ep=device_name&lt=3600&lwm2m=1.1&b=U'
          }
      
        // client request
        request(params).end()

        const r = new Promise((resolve, reject) => {
            server.on('request', (req) => {
                //console.log("client request", req.url)
                resolve(req.url)
            })
        })

        expect(await r).toBe('/rd?ep=device_name&lt=3600&lwm2m=1.1&b=U')
    })

    it("should send handshake request to server with agent", async () => {
        const agent = new coap.Agent({ type: 'udp4' })
        const objects = '<1/0>, <3/0>, <6/0>'
        const deviceName = 'device_name'
        const lifetime = '3600'
        const lwm2mV = "1.1"
        const biding = "U"
        const port = "5683"
        const host = "localhost"
        handShake(agent, objects, deviceName, lifetime, lwm2mV, biding, port, host) 

        const serverReceive: Promise<{url: string; payload:string}> = new Promise((resolve, reject) => {
            server.on('request', (req, res) => {
                //console.log('Hanshake request sent. This is received by the server here')
                res.end()
                resolve({url:req.url, payload:req.payload.toString()})
            })
        })

        const result = await serverReceive
        expect(result.url).toBe('/rd?ep=device_name&lt=3600&lwm2m=1.1&b=U')
        expect(result.payload).toBe(`</>;ct=11543;hb,${objects}`)
    })
    
})