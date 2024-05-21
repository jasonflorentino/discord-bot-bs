import Debug from "debug";
import { SlashCommandBuilder } from "discord.js";

import { Err } from "../../lib/index.js";

const debug = Debug("commands:roleAdd");

// Note users can only self-service roles
// that are _below_ this bot's role!
// Request will otherwise return a permission error.

export const data = new SlashCommandBuilder()
  .setName("add-role")
  .setDescription("Assign yourself a role")
  .addRoleOption((option) => {
    return option
      .setName("role")
      .setDescription("The role to assign for yourself")
      .setRequired(true);
  });

export async function execute(interaction) {
  debug("Start");
  let message;

  try {
    const role = interaction.options.getRole("role");
    await interaction.member.roles.add(role);
    message = `Added role "${role.name}"`;
  } catch (err) {
    debug(err, JSON.stringify(err, null, 2));
    message = Err.getReply(err);
  }
  debug("message:", message);
  await interaction.reply(message);
}
