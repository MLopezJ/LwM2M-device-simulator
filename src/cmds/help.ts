import {commands} from '../commands.js'

/**
 * Log in console the list of all possible commands
 */
export const help = () => {
    console.log("command required-param [optional param]")
    console.log(`Options:\n`)
    Object.values(commands).map(element => {
        console.log(`\t${element.title}\n`);
        console.log(`\t${element.description}\n`);
        console.log(`\tFormat: ${element.format}`);
        if (Array.isArray(element.example)){
            console.log(`\tExample:`);
            element.example.map(example => console.log(`\t\t${example}`))
        }else {
            console.log(`\tExample: ${element.example}`);
        }
        console.log(`-------------------------------------------------\n`)
    })
}
