import coap from 'coap'
import { handShake } from './reg'

/**
 * Create server to test initial handshake method
 */
export const handShakeTest = (): void => {
	const server = coap.createServer()

	server.listen(async () => {
		const objects =
			'<6/0>, <10256/0>, <50009/0>, <1/0>, <3/0>, <4/0>, <5/0>, <3303/0>, <3304/0>, <3323/0>, <3347/0>'
		//const agent = new coap.Agent({ type: 'udp4' })
		const deviceName = 'test'
		const lifetime = '60'
		const lwm2mV = '1.1'
		const biding = 'U'
		const port = '5683'
		const host = 'localhost'
		await handShake(objects, deviceName, lifetime, lwm2mV, biding, port, host) // agent
	})

	server.on('request', (req, res) => {
		// res.setOption('code', '2.01')
		res.end()
	})
}

// handShakeTest()

export const serverTest = (): void => {
	const server = coap.createServer()

	server.listen(() => {
		console.log('the server is listening')
		const req = coap.request('coap://localhost/test')

		req.on('response', (res) => {
			res.pipe(process.stdout)
		})

		req.end()
	})

	server.on('request', (req, res) => {
		const url = req.url.split('/')[1]
		res.end(`request received from  ${url}`)
	})
}

//serverTest()

export const s = (): coap.Server => {
	const server = coap.createServer()

	server.on('request', (req, res) => {
		// res.setOption('code', '2.01')
		res.end()
	})

	return server
}
