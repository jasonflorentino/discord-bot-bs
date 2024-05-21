import "dotenv/config";
import { REST, Routes } from "discord.js";
import Debug from "debug";

import { getCommands } from "../commands/index.js";
import { assert } from "../lib/index.js";

const debug = Debug("deployCommands");

/**
 * Reloads all commands.
 * Run from the `package.json` script
 * Use `global` as a first arg to update Global commands:
 *   `npm run deployCommands global`
 * Otherwise updates guild commands for Guild in .env:
 *   `npm run deployCommands`
 */
async function deployCommands() {
  debug("Start");
  const argv2 = process.argv[2];
  const updateIsGlobal = argv2 === "global";

  assert(
    argv2 ? updateIsGlobal : !argv2,
    `If passing an arg it should equal 'global', got '${argv2}.'`,
  );
  assert(process.env.DISCORD_TOKEN, "Expected a Token");
  assert(process.env.DISCORD_CLIENT_ID, "Expected a Client ID");
  if (!updateIsGlobal) {
    assert(process.env.DISCORD_GUILD_ID, "Expected a Guild ID");
  }

  const commands = await getCommands(new Array());
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const route = updateIsGlobal
    ? Routes.applicationCommands(process.env.DISCORD_CLIENT_ID)
    : Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID,
      );

  debug(`Updating ${updateIsGlobal ? "global" : "guild"} commands...`);

  try {
    debug(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(route, { body: commands });
    debug(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    debug(error);
  }
}

await deployCommands();
