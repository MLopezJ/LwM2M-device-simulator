import type { assetTracker } from "./assetTrackerV2.js";
import { clear, help, list, quit, register, set } from "./index.js";

type commandsObject = Record<
  string,
  {
    parameters: string[];
    description: string;
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
    parameters: ["objectId", "instanceId", "resourceId"],
    description: "\tList values",
    execute: list,
  },
  set: {
    parameters: ["objectId", "instanceId", "resourceId"],
    description: "\tList objects values",
    execute: set,
  },
  register: {
    parameters: [],
    description: "\tExecute registation to server",
    execute: register,
  },
  clear: {
    parameters: [],
    description: "\tClear console",
    execute: clear,
  },
  quit: {
    parameters: [],
    description: "\tExit the client",
    execute: quit,
  },
  help: {
    parameters: [],
    description: "\tList all possible commands",
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
