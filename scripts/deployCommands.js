import "dotenv/config";
import { REST, Routes } from "discord.js";
import Debug from "debug";

import { getCommands } from "../commands/index.js";

const debug = Debug("deployCommands");

async function deployCommands() {
  debug("Start");
  const commands = await getCommands(new Array());
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  try {
    debug(`Started refreshing ${commands.length} application (/) commands.`);
    // The PUT method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID,
      ),
      { body: commands },
    );
    debug(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    debug(error);
  }
}

await deployCommands();
