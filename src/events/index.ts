import { Client } from 'discord.js';
import { Kazagumo } from 'kazagumo';
import { handleInteraction } from './interactionCreate';
import { handleTrackStart } from './trackStart';
import { handleTrackEnd } from './trackEnd';

export function registerEvents(client: Client, kazagumo: Kazagumo) {
  client.on('interactionCreate', async (interaction) => {
    await handleInteraction(interaction);
  });

  kazagumo.on('playerStart', (player, track) => {
    handleTrackStart(player, track);
  });

  kazagumo.on('playerEnd', (player) => {
    handleTrackEnd(player);
  });
}