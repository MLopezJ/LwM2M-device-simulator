import type { assetTracker } from "./assetTrackerV2.js";
import { clear, help, list, quit, register, set } from "./cmds/index.js";

type commandsObject = Record<
  string,
  {
    title: string;
    parameters: string[];
    description: string;
    format: string;
    example: string | string[];
    execute: (
      command: string[] | never,
      objectList: assetTracker
    ) => void | assetTracker;
  }
>;

/**
 * List of commands to execute
 */
export const commands: commandsObject = {
  list: {
    title: 'List',
    parameters: ["objectId", "instanceId", "resourceId"],
    description: "\tList values",
    format: "list /[object-id]/[instance-id]/[resource-id]",
    example: ["list","list /3","list /3/0","list /3/0/0"],
    execute: list,
  },
  set: {
    title: 'Set',
    parameters: ["objectId", "instanceId", "resourceId"],
    description: "\tSet resource value",
    format: "set object-id/instance-id/resource-id value",
    example: "set /3/0/0 Nordic",
    execute: set,
  },
  register: {
    title: 'Register',
    parameters: [],
    description: "\tExecute registation to server",
    format: "register",
    example: "register",
    execute: register,
  },
  clear: {
    title: 'Clear',
    parameters: [],
    description: "\tClear console",
    format: "clear",
    example: "clear",
    execute: clear,
  },
  quit: {
    title: 'Quit',
    parameters: [],
    description: "\tExit the client",
    format: "quit",
    example: "quit",
    execute: quit,
  },
  help: {
    title: 'Help',
    parameters: [],
    description: "\tList all possible commands",
    format: "help",
    example: "help",
    execute: help,
  },
};

export const executeCommand = (
  command: string,
  parameters: string[],
  objectsList: assetTracker
): void | assetTracker => {
  const action = commands[`${command}`];
  if (action === undefined) {
    console.log("Wrong command");
    help();
  } else {
    const result = action.execute(parameters, objectsList);
    return result;
  }
};
