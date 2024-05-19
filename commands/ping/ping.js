import Debug from "debug";
import { SlashCommandBuilder } from "discord.js";

const debug = Debug("commands:ping");

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction) {
  debug("Start");
  await interaction.reply("Pong!");
}
