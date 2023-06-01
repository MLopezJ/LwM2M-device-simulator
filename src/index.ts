import * as readline from 'readline'
import { assetTrackerFirmwareV2 } from './assetTrackerV2.js'
import { executeCommand } from './commands.js'
import { getUserInput } from './getUserInput.js'

/**
 * Command Line Interface
 */
const cli = () => {
	let assetTrackerObjects = structuredClone(assetTrackerFirmwareV2)

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
		if (instructions.command === 'set' && result !== undefined)
			assetTrackerObjects = result
		rl.prompt()
	})
}

cli()
