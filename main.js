import "dotenv/config";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import Debug from "debug";

import { assert } from "./lib/index.js";
import { getCommands } from "./commands/index.js";
import * as Handlers from "./handlers/index.js";

const debug = Debug("main");
const token = process.env.DISCORD_TOKEN;
assert(token, `Expected token`);

debug("Creating client...");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

debug("Attaching commands...");
client.commands = await getCommands(new Collection());
client.on(Events.InteractionCreate, Handlers.handleInteractionCreate);

client.cooldowns = new Collection();

client.once(Events.ClientReady, (readyClient) => {
  debug(`Logged in as ${readyClient.user.tag}`);
});

debug("Logging in...");
client.login(token);
