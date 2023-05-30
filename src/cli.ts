/**
 * Command Line Interface
 */

import * as readline from "readline";
import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js";
import { executeCommand } from "./commands.js";

const init = () => {

    let assetTrackerObjects = structuredClone(assetTrackerFirmwareV2)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.setPrompt("LwM2M-Dev-Simulator> ")
    rl.prompt();

    rl.on('line', (userInput: string) => {
        const input = userInput.split(' ');
        const command = input[0] ?? ''
        const parameters = input.slice(1);
        const result = executeCommand(command, parameters, assetTrackerObjects)
        if (command === 'set' && result !== undefined) assetTrackerObjects = result
        rl.prompt()
    })
}

init()