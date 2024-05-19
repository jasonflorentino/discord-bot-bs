import Debug from "debug";

const debug = Debug("handleInteractionCreate");

export async function handleInteractionCreate(interaction) {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    debug(`No command with name ${interaction.commandName}.`);
    return;
  }

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
}

export default handleInteractionCreate;
