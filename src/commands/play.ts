import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { kazagumo } from '../index';
import { getSpotifyPlaylist } from '../utils/spotify';
import { isSpotifyUrl } from '../utils/urlValidator';

export const playCommand = {
  name: 'play',
  description: 'Play a song or playlist from YouTube/Spotify',
  options: [
    {
      name: 'query',
      type: ApplicationCommandOptionType.String,
      description: 'The song URL, playlist URL, or search query',
      required: true,
    },
  ],
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const query = interaction.options.getString('query', true);
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    
    if (!member?.voice.channel) {
      return interaction.reply({ 
        content: 'You must be in a voice channel!',
        ephemeral: true 
      });
    }

    const player = kazagumo.createPlayer({
      guildId: interaction.guildId!,
      channelId: member.voice.channel.id,
      textId: interaction.channelId,
      deaf: true,
    });

    await interaction.deferReply();

    try {
      // Handle Spotify playlist
      if (isSpotifyUrl(query) && query.includes('/playlist/')) {
        const tracks = await getSpotifyPlaylist(query);
        if (!tracks.length) {
          return interaction.editReply('No tracks found in the playlist!');
        }

        let firstTrack = null;
        for (const track of tracks) {
          const result = await kazagumo.search(`${track.name} ${track.artists[0]}`);
          if (!result.tracks.length) continue;

          if (!firstTrack) firstTrack = result.tracks[0];
          player.queue.add(result.tracks[0]);
        }

        if (!firstTrack) {
          return interaction.editReply('Could not load any tracks from the playlist!');
        }

        if (!player.playing && !player.paused) {
          player.play(firstTrack);
        }

        return interaction.editReply(
          `Added ${tracks.length} tracks from playlist to the queue!`
        );
      }

      // Handle regular search/URL
      const result = await kazagumo.search(query);
      if (!result.tracks.length) {
        return interaction.editReply('No results found!');
      }

      if (player.queue.length > 0 || player.playing) {
        player.queue.add(result.tracks[0]);
        return interaction.editReply(
          `Queued **${result.tracks[0].title}** by *${result.tracks[0].author}*`
        );
      }

      player.play(result.tracks[0]);
      return interaction.editReply(
        `Now playing **${result.tracks[0].title}** by *${result.tracks[0].author}*`
      );
    } catch (error) {
      console.error('Error in play command:', error);
      return interaction.editReply('An error occurred while processing your request.');
    }
  },
};