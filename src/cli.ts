import * as readline from "readline";
import { Command } from "commander";
import { index } from "./register";
import { assetTrackerFirmwareV2 } from "./assetTrackerV2.js"
import { Temperature_3303_urn } from '@nordicsemiconductor/lwm2m-types'

const program = new Command();

let value: number

program
    .name("Device Simulator")
    .description("Virtual implementation of Thingy:91 with Asset Tracker firmware to send LwM2M data to Coiote")

program.command('connect')
    .description('Implement Bootstraping factory and connect device to Coiote.')
    .action(() => {
        index()
        console.log('connecting to Coiote')
        value = 5
    });

program.command('update')
    .description('...')
    .action(() => {
        console.log('Updating values')
        value += 1
        assetTrackerFirmwareV2[Temperature_3303_urn]![0]!["5700"] = Math.floor(Math.random() * (85 - -40 + 1) + -40);
        console.log(assetTrackerFirmwareV2[Temperature_3303_urn]);
        index()
    });

program.command('quit')
    .description('exit')
    .action(() => {
        console.log('quiting')
    });

var rdLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//rdLine.prompt();

console.log('connect. update. quit')
rdLine.on('line', function (line: string) {
    program.parse([line] , { from : 'user'});
    if(line === 'quit') rdLine.close();
    else {
        console.log(value)
        console.log("press control + c to exit or add another command to continue")
        console.log('connect. update. quit')
    }
});

// async option https://stackoverflow.com/questions/58096673/how-to-make-readline-work-inside-a-loop-in-typescript 
