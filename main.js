import { Client, Events, GatewayIntentBits } from 'discord.js';

import { assert } from './utils/index.js'
import { getCommands } from './commands/index.js'

const token = process.env.DISCORD_TOKEN;
assert(token, `Expected token`);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = await getCommands();

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(token);
