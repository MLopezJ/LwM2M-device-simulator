import type { assetTracker } from './assetTrackerV2.js'
import {
	clear,
	help,
	list,
	quit,
	register,
	registerDevice,
} from './cmds/index.js'
import { set } from './cmds/set.js'

type commandsObject = Record<
	string,
	{
		title: string
		parameters: string[]
		description: string
		format: string
		example: string | string[]
		execute: (
			command: string[] | never,
			objectList: assetTracker,
		) => void | assetTracker | Promise<void | string>
	}
>

/**
 * List of commands to execute
 */
export const commands: commandsObject = {
	list: {
		title: 'List',
		parameters: ['objectId', 'instanceId', 'resourceId'],
		description: 'List values',
		format: 'list /[object-id]/[instance-id]/[resource-id]',
		example: ['list', 'list /3', 'list /3/0', 'list /3/0/0'],
		execute: list,
	},
	set: {
		title: 'Set',
		parameters: ['objectId', 'instanceId', 'resourceId'],
		description: 'Set resource value',
		format: 'set object-id/instance-id/resource-id value',
		example: 'set /3/0/0 Nordic',
		execute: set as any, // TODO: fix type
	},
	register: {
		title: 'Register',
		parameters: [],
		description: 'Execute registation to server',
		format: 'register',
		example: 'register',
		execute: register,
	},
	clear: {
		title: 'Clear',
		parameters: [],
		description: 'Clear console',
		format: 'clear',
		example: 'clear',
		execute: clear,
	},
	quit: {
		title: 'Quit',
		parameters: [],
		description: 'Exit the client',
		format: 'quit',
		example: 'quit',
		execute: quit,
	},
	help: {
		title: 'Help',
		parameters: [],
		description: 'List all possible commands',
		format: 'help',
		example: 'help',
		execute: help,
	},
	// TODO: remove down
	reg: {
		title: 'temporal register command',
		parameters: [],
		description: 'register objects',
		format: 'reg',
		example: 'reg',
		execute: registerDevice,
	},
	// TODO: remove up
}

export const executeCommand = (
	command: string,
	parameters: string[],
	objectsList: assetTracker,
): void | assetTracker | Promise<void | string> => {
	const action = commands[`${command}`]
	if (action === undefined) {
		console.log('Wrong command')
		help()
	} else {
		const result = action.execute(parameters, objectsList)
		return result
	}
}
