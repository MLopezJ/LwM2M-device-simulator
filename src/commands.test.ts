import { assetTrackerFirmwareV2 } from './assetTrackerV2'
import { executeCommand } from './commands'

describe('executeCommand', () => {
	it('should return asset tracker object when executing set command', () => {
		expect(
			executeCommand('set', ['/3/0/1'], assetTrackerFirmwareV2),
		).toMatchObject(assetTrackerFirmwareV2)
	})

	it.each([
		['help', ['']],
		['clear', ['']],
		['list', ['list']],
	])(`should return void when execute '%s' command`, (command, params) => {
		expect(executeCommand(command, params, assetTrackerFirmwareV2)).toBe(
			undefined,
		)
	})

	it.each([
		['helpa', ['']],
		['list ', ['list']],
	])(
		`should return undefined when execute wrong command: '%s'`,
		(command, params) => {
			expect(executeCommand(command, params, assetTrackerFirmwareV2)).toBe(
				undefined,
			)
		},
	)
})
