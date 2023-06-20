import * as readline from 'readline'
import { assetTrackerFirmwareV2, type assetTracker } from './assetTrackerV2.js'
import { executeCommand } from './commands.js'
import { getUserInput } from './getUserInput.js'

/**
 * check if element is a promise
 */
const isPromise = (element: unknown) =>
	typeof element === 'object' && typeof (element as any).then === 'function'
		? true
		: false

/**
 * Command Line Interface
 */
const cli = () => {
	let assetTrackerObjects = assetTrackerFirmwareV2

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	rl.setPrompt('LwM2M-Dev-Simulator> ')
	rl.prompt()

	rl.on('line', (input: string) => {
		const instructions = getUserInput(input)
		const result = executeCommand(
			instructions.command,
			instructions.parameters,
			assetTrackerObjects,
		)
		if (
			instructions.command === 'set' &&
			result !== undefined &&
			isPromise(result) === false
		)
			assetTrackerObjects = result as assetTracker
		rl.prompt()
	})
}

cli()
