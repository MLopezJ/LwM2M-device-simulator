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

/**
 * Set new value in LwM2M object list
 * TODO: This logic should have its own file with test cases as well
 */
const seta = (command: string[]) => {
    const path = getElementPath(command[0]??'')
    const value = command[1]
    //const objectURI: keyof LwM2MDocument | undefined = correlationTable[`${path.objectId}`] as keyof LwM2MDocument ?? undefined
    const objectURI: keyof LwM2MDocument = correlationTable[`${path.objectId}`] as keyof LwM2MDocument 
    if (objectURI === undefined){
        console.log(`\nError: Object ${path.objectId} do not exist in object list \n--------------------------------\n`)
        return
    }

    // LwM2M object
    const element  = assetTrackerFirmwareV2[`${objectURI}`]

    // This condition is repeated but been added because object could be undefined just because of the typescript rules
    if (element === undefined){
        console.log(`\nError: Object ${path.objectId} do not exist in object list \n--------------------------------\n`)
        return
    }

    const isSingleInstance = !Array.isArray(element)

    if (isSingleInstance){
        if (path.instanceId !== 0){
            console.log(`\nError: Object ${path.objectId} is single instance. \n--------------------------------\n`)
            return
        }

        // TODO Solve this typescript issue
        // set value
        // @ts-ignore
        assetTrackerFirmwareV2![`${objectURI}`]![`${path.resourceId}`]! = value
    } else{
        // multiple instance case
        if (element.length -1 < path.instanceId){
            console.log(`\nError: Instance ${path.instanceId} of object ${path.objectId} do not exist on list. \n--------------------------------\n`)
            return
        }

        const resourceOptions = element[`${path.instanceId}`]

        if (resourceOptions[`${path.resourceId}`] === undefined){
            console.log(`\nError: Resource ${path.resourceId} do not exist on ${path.objectId}/${path.instanceId}. \n--------------------------------\n`)
            return
        }

        // TODO Solve this typescript issue
        // set value
        // @ts-ignore
        assetTrackerFirmwareV2[`${objectURI}`]![path.instanceId]![`${path.resourceId}`] = value
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
 * bootstrap
 */
const bootstrapa = () => {

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

    //console.log(process.argv)
}

init()