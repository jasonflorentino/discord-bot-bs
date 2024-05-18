import fs from 'node:fs'
import path from 'node:path'
import { Collection } from 'discord.js';

import { assert } from '../utils/index.js';

const __dirname = import.meta.dirname;

export async function getCommands() {
	const collection = new Collection();

	const dirs = fs.readdirSync(__dirname)
		.filter((name) => fs.lstatSync(path.join(__dirname, name)).isDirectory());

	for (const dir of dirs) {
		const commandsPath = path.join(__dirname, dir);
		const commandFiles = fs.readdirSync(commandsPath)
			.filter((filename) => isCommandFile(dir, filename));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(filePath);

			assert('data' in command, `Expected file ${file} at ${filePath} to export 'data' property`);
			assert('execute' in command, `Expected file ${file} at ${filePath} to export 'execute' property`);

			collection.set(command.data.name, command);
		}
	}

	return collection;
}

function isCommandFile(dir, filename) {
	// is .js file and file name matches the dir name
	return filename.endsWith('.js') && path.parse(filename).name === dir
}
