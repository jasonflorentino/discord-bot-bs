import Debug from "debug";
import { SlashCommandBuilder } from "discord.js";

import { Err } from "../../lib/index.js";

const debug = Debug("commands:roleRemove");

// Note users can only self-service roles
// that are _below_ this bot's role!
// Request will otherwise return a permission error.

export const data = new SlashCommandBuilder()
  .setName("remove-role")
  .setDescription("Remove a role from yourself")
  .addRoleOption((option) => {
    return option
      .setName("role")
      .setDescription("The role to remove from yourself")
      .setRequired(true);
  });

export async function execute(interaction) {
  debug("Start");
  let message;

  try {
    const role = interaction.options.getRole("role");
    await interaction.member.roles.remove(role);
    message = `Removed role "${role.name}"`;
  } catch (err) {
    debug(err, JSON.stringify(err, null, 2));
    message = Err.getReply(err);
  }
  debug("message:", message);
  await interaction.reply({ content: message, ephemeral: true });
}
