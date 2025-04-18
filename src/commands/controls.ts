import { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  CommandInteraction 
} from 'discord.js';
import { kazagumo } from '../index';

export const controlsCommand = {
  name: 'controls',
  description: 'Show music player controls',
  async execute(interaction: CommandInteraction) {
    const player = kazagumo.players.get(interaction.guildId!);
    
    if (!player) {
      return interaction.reply({
        content: 'No music is currently playing!',
        ephemeral: true
      });
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('pause')
          .setLabel(player.paused ? 'Resume' : 'Pause')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('skip')
          .setLabel('Skip')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('Stop')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('loop')
          .setLabel('Loop')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({
      content: 'Music Controls:',
      components: [row]
    });
  },
};