/**
 * Log in console the list of all possible commands
 * TODO: add the rest of commands
 * TODO: uses commands global var instead of the internal one. Make no sense to have same logic in 2 different places
 */
export const help = () => {
    const commands = [{
        title: 'Clear',
        description: 'Clear CLI',
        command: 'clear',
        example: 'clear'
    },
    {
        title: 'Register',
        description: 'Register device to Coiote',
        command: 'register [port]',
        example: 'register'
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