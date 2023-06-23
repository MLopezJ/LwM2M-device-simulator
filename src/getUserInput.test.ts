import { getUserInput } from './getUserInput'

describe('getUserInput', () => {
	it.each([
		['list', 'list', []],
		['list /3', 'list', ['/3']],
		['list /3/0', 'list', ['/3/0']],
		['list /3/0/0', 'list', ['/3/0/0']],
		['list ', 'list', ['']],
		['list /3/0 /0', 'list', ['/3/0', '/0']],

		['set /3/0/0 Nordic', 'set', ['/3/0/0', 'Nordic']],
		['set /3 Nordic', 'set', ['/3', 'Nordic']],

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

	it(`should return an empty string ('') as a command and an empty list ([]) as a parameters if input is an empty string`, () => {
		const input = ''
		const result = getUserInput(input)
		const expectedCommand = ''
		const expectedParameters = []
		expect(result.command).toStrictEqual(expectedCommand)
		expect(result.parameters.length).toBe(expectedParameters.length)
	})
})
