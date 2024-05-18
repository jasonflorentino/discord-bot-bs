import fs from "node:fs";
import path from "node:path";
import { Collection } from "discord.js";

import { assert } from "../utils/index.js";

const __dirname = import.meta.dirname;

/**
 * @returns a `Collection` with all the commands
 * in the /commands directory
 */
export async function getCommands() {
  const collection = new Collection();

  // Get only the directories here
  const dirs = fs
    .readdirSync(__dirname)
    .filter((name) => fs.lstatSync(path.join(__dirname, name)).isDirectory());

  for (const dir of dirs) {
    // Get only the command file from each directory
    const commandsPath = path.join(__dirname, dir);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((filename) => isCommandFile(dir, filename));

    // Dont think there'd be more than one command file
    // per folder, but we got an iterator so...
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);

      assert(
        "data" in command,
        `Expected file ${file} at ${filePath} to export 'data' property`,
      );
      assert(
        "execute" in command,
        `Expected file ${file} at ${filePath} to export 'execute' property`,
      );

      collection.set(command.data.name, command);
    }
  }

  return collection;
}

function isCommandFile(dir, filename) {
  // is .js file and file name matches the dir name
  return filename.endsWith(".js") && path.parse(filename).name === dir;
}
