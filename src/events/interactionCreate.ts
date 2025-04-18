import { BaseInteraction } from 'discord.js';

export async function handleInteraction(interaction: BaseInteraction) {
  // Only handle chat input commands
  if (!interaction.isChatInputCommand()) return;

  try {
    // Get the command name
    const commandName = interaction.commandName;

    // Get the command module
    const command = (await import(`../commands/${commandName}`)).default;

    // Execute the command
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);

    // If the interaction is still valid, reply with an error message
    if (interaction.isRepliable()) {
      const content = {
        content: 'There was an error while executing this command!',
        ephemeral: true
      };
      
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(content);
      } else {
        await interaction.reply(content);
      }
    }
  }
}