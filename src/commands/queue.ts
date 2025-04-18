import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { kazagumo } from '../index';

export const queueCommand = {
  name: 'queue',
  description: 'Display the current music queue',
  async execute(interaction: CommandInteraction) {
    const player = kazagumo.players.get(interaction.guildId!);
    
    if (!player) {
      return interaction.reply({
        content: 'No music is currently playing!',
        ephemeral: true
      });
    }

    const queue = player.queue;
    const currentTrack = player.queue.current;

    const embed = new EmbedBuilder()
      .setTitle('Music Queue')
      .setColor('#3498db');

    if (currentTrack) {
      embed.addFields({
        name: 'Now Playing',
        value: `**${currentTrack.title}** by *${currentTrack.author}*`
      });
    }

    if (queue.length) {
      const tracks = queue.map((track, index) => 
        `${index + 1}. **${track.title}** by *${track.author}*`
      ).slice(0, 10);

      embed.addFields({
        name: 'Up Next',
        value: tracks.join('\n')
      });

      if (queue.length > 10) {
        embed.setFooter({
          text: `And ${queue.length - 10} more tracks...`
        });
      }
    }

    await interaction.reply({ embeds: [embed] });
  },
};