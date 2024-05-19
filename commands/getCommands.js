import fs from "node:fs";
import path from "node:path";
import Debug from "debug";
import { Collection } from "discord.js";

import { assert } from "../utils/index.js";

const __dirname = import.meta.dirname;
const debug = Debug("commands:getCommands");

export const errors = {
  NO_INPUT: `Expected collection`,
  BAD_INPUT: `Unknown collection type`,
};

/**
 * @returns the input collection with all the commands
 * in the /commands directory
 */
export async function getCommands(collection) {
  assert(collection, errors.NO_INPUT);

  // Determine how to handle commands based on input

  let _addCommand;

  switch (true) {
    case collection instanceof Collection:
      _addCommand = (cmd) => {
        collection.set(cmd.data.name, cmd);
      };
      break;
    case Array.isArray(collection):
      _addCommand = (cmd) => {
        collection.push(cmd.data.toJSON());
      };
      break;
    default:
      throw new Error(errors.BAD_INPUT);
  }

  // Load commands from sibling dirs

  const dirs = fs
    .readdirSync(__dirname)
    .filter((name) => fs.lstatSync(path.join(__dirname, name)).isDirectory());
  debug(`Found ${dirs.length} command directories`);

  for (const dir of dirs) {
    // Get only the command file from each directory
    const commandsPath = path.join(__dirname, dir);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((filename) => isCommandFile(dir, filename));

    assert(
      commandFiles.length === 1,
      `Wut? There's more than one command per directory?`,
    );

    const file = commandFiles.pop();
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    debug(`Loading ${file}...`);

    assert(
      "data" in command,
      `Expected file ${file} at ${filePath} to export 'data' property`,
    );
    assert(
      "execute" in command,
      `Expected file ${file} at ${filePath} to export 'execute' property`,
    );

    _addCommand(command);
  }

  debug(`Done`);
  return collection;
}

function isCommandFile(dir, filename) {
  // is .js file and file name matches the dir name
  return filename.endsWith(".js") && path.parse(filename).name === dir;
}
