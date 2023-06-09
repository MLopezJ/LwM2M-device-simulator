import type { assetTracker } from '../assetTrackerV2.js'
import { commands } from '../commands.js'
import { createRegisterQuery } from '../utils/createRegisterQuery.js'
import { help as helpCmd } from './help.js'
import { list as listCmd } from './list.js'
import { registerDeviceObjects } from './reg.js'
import { register as registerCmd, sendRegistrationRequest } from './register.js'

/**
 * Clear console
 */
export const clear = (): void => console.clear()

/**
 * Quit console
 */
export const quit = (): void => {
	console.log('\nExiting client...\n--------------------------------\n')
	process.exit()
}

/**
 * Connector method to list info about available commands
 */
export const help = (): void => helpCmd()

/**
 * Connector method to execute list of objects
 */
export const list = async (
	userInput: string[],
	objectsList: assetTracker,
): Promise<void | undefined> => {
	const input = userInput[0]

	const result = await listCmd(input, objectsList)

	if (result === undefined) {
		console.log(`\nExpected format:  \n\t${commands['list']?.format}`)
		if (Array.isArray(commands['list']?.example)) {
			console.log(`Example:`)
			commands['list']?.example.map((example) => console.log(`\t${example}`))
		}
		console.log(`\n`)
		return
	}

	console.log(result)
}

/**
 * Connector method to execute registration on Coiote
 */
export const register = (command: string[] | never, list: assetTracker): void =>
	registerCmd(list, createRegisterQuery, sendRegistrationRequest)

/**
 * Temporal connector method
 * TODO: remove this
 */
export const registerDevice = async (
	command: string[] | never,
	list: assetTracker,
): Promise<void | string> =>
	await registerDeviceObjects({
		deviceObjects: list,
		resource: undefined,
		deviceName: undefined,
		lifetime: undefined,
		biding: undefined,
		port: undefined,
		host: undefined,
		lwm2mV: undefined,
	})
