import { Collection } from "discord.js";
import Debug from "debug";

import { assert, Constants } from "../lib/index.js";

const debug = Debug("handlers:handleInteractionCreate");

export async function handleInteractionCreate(interaction) {
  debug(`interaction:`, interaction);
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    debug(`No command with name ${interaction.commandName}.`);
    return;
  }

  // Handle cooldowns for this user x command

  const timestamps = getTimestampsForCommand(
    interaction.client.cooldowns,
    command.data.name,
  );

  const cooldownReply = getCooldownReply({
    timestamps,
    command,
    userId: interaction.user.id,
  });

  if (cooldownReply) {
    return interaction.reply(cooldownReply);
  }

  // Execute command

  try {
    await command.execute(interaction);
  } catch (err) {
    const action =
      interaction.replied || interaction.deferred
        ? interaction.followUp
        : interaction.reply;
    const payload = {
      content: "There was an error while executing this command!",
      ephemeral: true,
    };
    await action(payload);
  }
  debug("Finished");
}

export default handleInteractionCreate;

/**
 * @typedef {Record<userId, lastUsedTime} CommandTimestamps
 */

/**
 * @returns {CommandTimestamps} User timestamps for the given command
 */
function getTimestampsForCommand(cooldowns, commandName) {
  assert(cooldowns, "Expected cooldowns");
  assert(commandName, "Expected commandName");

  let timestamps;

  if (cooldowns.has(commandName)) {
    timestamps = cooldowns.get(commandName);
  } else {
    timestamps = new Collection();
    cooldowns.set(commandName, timestamps);
  }

  return timestamps;
}

/**
 * @typedef GetCooldownReplyArgs
 * @property {CommandTimestamps} timestamps Timestamps for when users last used a command
 */

/**
 * @param {GetCooldownReplyArgs} args
 */
function getCooldownReply(args) {
  const { timestamps, userId, command } = args;
  assert(timestamps, "Expected timestamps");
  assert(userId, "Expected userId");
  assert(command, "Expected command");

  const now = Date.now();
  const cooldownS = command.cooldown ?? Constants.DEFAULT_COOLDOWN_SECONDS;
  const cooldownMs = cooldownS * 1000;
  let cooldownReply = null;

  if (timestamps.has(userId)) {
    const expirationTimeMs = timestamps.get(userId) + cooldownMs;
    if (now < expirationTimeMs) {
      const expirationTimeSeconds = Math.round(expirationTimeMs / 1000);
      cooldownReply = {
        content: `Please wait, you have a cooldown for \`${command.data.name}\`. You can use it again <t:${expirationTimeSeconds}:R>.`,
        ephemeral: true,
      };
    }
  }

  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownMs);

  return cooldownReply;
}
