import {set as setCmd} from './set.js'
import {register as registerCmd} from './register.js'
import { list as listCmd} from './list.js'
import {help as helpCmd} from './help.js'
import type { assetTracker } from '../assetTrackerV2.js'
import { getElementPath } from '../utils/getElementPath.js'

/**
 * Clear console
 */
export const clear = () => console.clear()

/**
 * Quit console
 */
export const quit = () => {
    console.log('\nExiting client...\n--------------------------------\n')
    process.exit()
}

/**
 * Connector method to list info about available commands
 * TODO: make no sense to have it in separe file
 */
export const help = () => helpCmd()

/**
 * Connector method to update the resource value of an object
 */
export const set = (userInput: string[], list: assetTracker) => {
    const path = getElementPath(userInput[0]??'')
    const value = userInput[1]
    
    const result = setCmd(list, path, value?? '')

    return result
}

/**
 * Connector method to execute list of objects
 */
export const list = (userInput: string[], objectsList: assetTracker) => {
    const input = userInput[0]

    const result = listCmd(input, objectsList)

    if (result === undefined){
        console.log('Error')
        return 
    }

    console.log(result)
}

/**
 * Connector method to execute registration on Coiote
 */
export const register = (command: string[]|never, list: assetTracker) => registerCmd(list)