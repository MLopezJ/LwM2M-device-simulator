/**
 * Get the instructions to execute commands from the user input
 */
export const getUserInput = (
	userInput: string,
): { command: string; parameters: string[] } => {
	const input = userInput.split(' ')
	const command = input[0] ?? ''
	const parameters = input.slice(1)

	return { command: command, parameters: parameters }
}
