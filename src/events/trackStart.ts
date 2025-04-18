import { Player, Track } from 'kazagumo';

export function handleTrackStart(player: Player, track: Track) {
  const channel = player.textChannel;
  if (!channel) return;

  // Send a message when a track starts playing
  channel.send({
    embeds: [{
      title: '🎵 Now Playing',
      description: `**${track.title}**\nRequested by: ${track.requester}`,
      color: 0x3498db,
      thumbnail: {
        url: track.thumbnail || 'https://i.imgur.com/2CdKEvF.png'
      },
      fields: [
        {
          name: 'Duration',
          value: track.length === 0 ? 'Live' : new Date(track.length).toISOString().slice(11, 19),
          inline: true
        },
        {
          name: 'Author',
          value: track.author || 'Unknown',
          inline: true
        }
      ]
    }]
  }).catch(console.error);
}