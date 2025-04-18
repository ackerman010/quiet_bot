import { Client } from 'discord.js';
import { playCommand } from './play';
import { controlsCommand } from './controls';
import { queueCommand } from './queue';
import { filtersCommand } from './filters';

export const commands = [
  playCommand,
  controlsCommand,
  queueCommand,
  filtersCommand,
];

export async function registerCommands(client: Client) {
  try {
    console.log('Started refreshing application (/) commands.');
    await client.application?.commands.set(commands);
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error refreshing commands:', error);
  }
}