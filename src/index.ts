//import type { Agent } from 'coap'
import type { Agent } from 'coap'
import {set as setCmd} from '../src/cmds/set.js'
import { assetTrackerFirmwareV2, type assetTracker } from './assetTrackerV2.js'
import { bootstrap as bootstrapCmd } from './cmds/bootstrap.js'
import {register as registerCmd} from './cmds/register.js'
import { list as listCmd} from './cmds/list.js'
//import { index } from './register.js'
import { getElementPath } from './utils.js'

/**
 * Second layer of the app
 */

export let objectList: assetTracker | undefined = undefined
let agent: Agent | undefined = undefined

/**
 * Connector method to update the resource value of an object
 */
export const set = (command: string[]) => {
    const path = getElementPath(command[0]??'')
    const value = command[1]
    if (objectList === undefined){
        console.log(
            `\nError: Factory Bootstrap is not executed\n--------------------------------\n`
          );
        return
    }
    const result = setCmd(objectList, path, value?? '')

    if (result !== undefined) objectList = result

    //console.log(objectList, assetTrackerFirmwareV2)
}

export const bootstrap = () => {
    //console.log('no effects here')
    //return
    //objectList = structuredClone(assetTrackerFirmwareV2)
    
    const result = bootstrapCmd()
    
    objectList = result[0]
    agent = result[1]
    // TODO: add successfull message
}

/**
 * Connector method to execute list of objects
 */
export const list = (command: string[]) => {
    const result = listCmd(command, assetTrackerFirmwareV2)

    if (result === undefined){
        console.log('Error')
        return 
    }
    console.log(result)
}

/**
 * Connector method to execute registration on Coiote
 */
export const register = () => {
    
    if (objectList === undefined || agent === undefined){
        console.log('Executing Factory Bootstrap')
        const result = bootstrapCmd()
        objectList = result[0]
        agent = result[1]

        //objectList = structuredClone(assetTrackerFirmwareV2)
        /*
        console.log(
            `\nError: Factory Bootstrap should be executed first\n--------------------------------\n`
        );
        return
        */
    }
    //index()
    registerCmd(objectList, agent)

}