import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { kazagumo } from '../index';

const FILTERS = {
  bassboost: {
    equalizer: [
      { band: 0, gain: 0.6 },
      { band: 1, gain: 0.7 },
      { band: 2, gain: 0.8 },
      { band: 3, gain: 0.55 },
    ],
  },
  '8d': {
    rotation: { rotationHz: 0.2 },
  },
  nightcore: {
    timescale: { pitch: 1.2, rate: 1.1 },
  },
  vaporwave: {
    timescale: { pitch: 0.8, rate: 0.9 },
  },
};

export const filtersCommand = {
  name: 'filters',
  description: 'Apply audio filters to the current track',
  options: [
    {
      name: 'filter',
      type: ApplicationCommandOptionType.String,
      description: 'The filter to apply',
      required: true,
      choices: [
        { name: 'Bass Boost', value: 'bassboost' },
        { name: '8D', value: '8d' },
        { name: 'Nightcore', value: 'nightcore' },
        { name: 'Vaporwave', value: 'vaporwave' },
        { name: 'Reset', value: 'reset' },
      ],
    },
  ],
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const player = kazagumo.players.get(interaction.guildId!);
    
    if (!player) {
      return interaction.reply({
        content: 'No music is currently playing!',
        ephemeral: true
      });
    }

    const filter = interaction.options.getString('filter', true);

    if (filter === 'reset') {
      await player.clearFilters();
      return interaction.reply('Filters have been reset!');
    }

    await player.setFilters(FILTERS[filter as keyof typeof FILTERS]);
    return interaction.reply(`Applied ${filter} filter!`);
  },
};