import {set as setCmd} from '../src/cmds/set.js'
import { assetTrackerFirmwareV2, type assetTracker } from './assetTrackerV2.js'
import { bootstrap as bootstrapCmd } from './cmds/bootstrap.js'
import { getElementPath } from './utils.js'

/**
 * Second layer of the app
 */

let objectList: assetTracker | undefined = undefined
let agent = undefined

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

    console.log(objectList, assetTrackerFirmwareV2)
}

export const bootstrap = () => {
    const result = bootstrapCmd()
    
    objectList = result[0]
    agent = result[1]
}

export const list = () => {}