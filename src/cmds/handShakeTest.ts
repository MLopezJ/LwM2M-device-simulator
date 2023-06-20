import coap from 'coap'
import { handShake } from './reg'

/**
 * Create server to test initial handshake method
 */
const handShakeTest = () => {
	const server = coap.createServer()

	server.listen(async () => {
		const objects =
			'<6/0>, <10256/0>, <50009/0>, <1/0>, <3/0>, <4/0>, <5/0>, <3303/0>, <3304/0>, <3323/0>, <3347/0>'
		const deviceName = 'test'
		const lifetime = '60'
		const lwm2mV = '1.1'
		const biding = 'U'
		const port = '5683'
		const host = 'localhost'
		await handShake(objects, deviceName, lifetime, lwm2mV, biding, port, host)
	})

	server.on('request', (req, res) => {
		// res.setOption('code', '2.01')
		res.end()
	})
}

handShakeTest()
