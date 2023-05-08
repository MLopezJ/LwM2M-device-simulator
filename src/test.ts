/**
 * Implementing CLI
 */
import * as readline from "readline";
import { assetTrackerFirmwareV2, correlationTable } from "./assetTrackerV2.js"
import { getElementPath } from "./utils";
import type { LwM2MDocument } from "@nordicsemiconductor/lwm2m-types";
import {set, bootstrap} from '../src/index.js'

const list = (command: string[]) => {
    const object = command[0]
    if (object !== undefined){
        const path = getElementPath(object)
        const objectURI: keyof LwM2MDocument = correlationTable[`${path.objectId}`] as keyof LwM2MDocument 
        console.log(assetTrackerFirmwareV2[`${objectURI}`])
    } else{
        console.log(assetTrackerFirmwareV2)
    }
}

const quit = () => {
    console.log('\nExiting client...\n--------------------------------\n')
    process.exit()
}

const clear = () => {
    console.clear();
}

/**
 * Log in console the list of all possible commands
 */
const help = () => {
    const commands = [{
        title: 'Clear',
        description: 'Clear CLI',
        command: 'clear',
        example: 'clear'
    },
    {
        title: 'List',
        description: 'List the values of requested object',
        command: 'list [object id]',
        example: 'list 3'
    },
    {
        title: 'Quit',
        description: 'Exit CLI',
        command: 'quit',
        example: 'quit'
    }
    ]

    console.log("command required-param [optional param]")
    console.log(`Options:\n`)
    commands.map(cmd => {
        console.log(`\t${cmd.title}\n`);
        console.log(`\t${cmd.description}`);
        console.log(`\tCommand: ${cmd.command}`);
        console.log(`\tExample: ${cmd.example}`);
        console.log(`--------------------------------------------\n`)
    })
}


const commands: Record<string, {parameters: string[], description: string, handler: (command: string[]|never) => void}> = {
    'list': {
        parameters: ['objectId', 'instanceId', 'resourceId'],
        description: '\tList values',
        handler: list
    },
    'set': {
        parameters: ['objectId', 'instanceId', 'resourceId'],
        description: '\tList objects values',
        handler: set
    },
    'bootstrap': {
        parameters: [],
        description: '\tExecute the factory bootstrap',
        handler: bootstrap
    },
    'rergister': {
        parameters: [],
        description: '\tExecute registation to server',
        handler: set
    },
    'clear': {
        parameters: [],
        description: '\tClear console',
        handler: clear
    },
    'quit': {
        parameters: [],
        description: '\tExit the client',
        handler: quit
    },
    'help': {
        parameters: [],
        description: '\tList all possible commands',
        handler: help
    }
}

const executeCommand = (command: string, parameters: string[]) => {
    if (commands[`${command}`] === undefined ){
        console.log('Wrong command')
    } else{
        commands[`${command}`]!.handler(parameters)
    }
}

const init = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.setPrompt("LwM2M-Dev-Simulator> ")
    rl.prompt();

    rl.on('line', (userInput: string) => {
        // from user input, first is the command and second is the params
        const input = userInput.split(' ');
        const command = input[0] ?? ''
        const parameters = input.slice(1);
        executeCommand(command, parameters)
        rl.prompt()
    })
}

init()