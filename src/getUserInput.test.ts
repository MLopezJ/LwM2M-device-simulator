import { getUserInput } from './getUserInput'

describe('getUserInput', () => {
	it.each([
		['list', 'list', []],
		['list /3', 'list', ['/3']],
		['list /3/0', 'list', ['/3/0']],
		['list /3/0/0', 'list', ['/3/0/0']],
		['list ', 'list', ['']],
		['list /3/0 /0', 'list', ['/3/0', '/0']], // TODO: test error

		['set /3/0/0 Nordic', 'set', ['/3/0/0', 'Nordic']],
		['set /3 Nordic', 'set', ['/3', 'Nordic']], // TODO: test error

		['register', 'register', []],
		['register ', 'register', ['']],

		['clear', 'clear', []],
		['clear ', 'clear', ['']],

		['quit', 'quit', []],
		['quit ', 'quit', ['']],

		['help', 'help', []],
		['help ', 'help', ['']],
	])(
		"should get instruction from the following user input: '%s'",
		(input: string, command: string, parameters: string[]) => {
			const result = getUserInput(input)
			expect(result.command).toBe(command)
			expect(result.parameters).toStrictEqual(parameters)
		},
	)
})
