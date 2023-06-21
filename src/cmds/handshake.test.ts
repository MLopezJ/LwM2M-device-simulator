import coap, { createServer, request, Server } from 'coap'
import { handShake } from "./handShake"
import { type CoapMethod } from 'coap-packet'
import { randomUUID } from 'crypto'

describe("handshake", () => {
    let server: Server

    const agent = new coap.Agent({ type: 'udp4' })
    const objects = '<1/0>, <3/0>, <6/0>'
    const deviceName = 'device_name'
    const lifetime = '3600'
    const lwm2mV = "1.1"
    const biding = "U"
    const port = "5683"
    const host = "localhost"

    beforeEach(async () => {
        server = createServer()
        server.listen(5683)
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

        const r = new Promise((resolve) => {
            server.on('request', (req) => {
                //console.log("client request", req.url)
                resolve(req.url)
            })
        })

        expect(await r).toBe('/rd?ep=device_name&lt=3600&lwm2m=1.1&b=U')
    })

    it("should send handshake request to server with agent", async () => {
        const deviceName = randomUUID()

        // Given a request arrives, server answers
        const request  = new Promise<{url: string; payload:string}>((resolve) => {
            server.on('request', (req, res) => {
                //console.log('Hanshake request sent. This is received by the server here')
                res.end()
                resolve({url:req.url, payload:req.payload.toString()})
            })
        })

        // When I do the request
        await handShake(agent, objects, deviceName, lifetime, lwm2mV, biding, port, host) 

        const result = await request

        // Then the client should have sent the correct handshake
        expect(result.url).toBe(`/rd?ep=${deviceName}&lt=3600&lwm2m=1.1&b=U`)
        expect(result.payload).toBe(`</>;ct=11543;hb,${objects}`)
    })

    it("should handle internal server error handshake response ", async () => {
        // Given, the server responds with an internal server error
        server.on('request', (req, res) => {
                res.setOption('code', '5.00').end()
                res.end() 
        })

        // When I do the request
        // Then I should receive an error
        try {
            await handShake(agent, objects, deviceName, lifetime, lwm2mV, biding, port, host)
            throw new Error("didn't throw");
        } catch (error) {
            expect((error as Error).message).toMatch(/Server does not accept the request/)
          }
    })
    
})