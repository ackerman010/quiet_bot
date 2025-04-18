import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Kazagumo, Plugins } from 'kazagumo';
import { Connectors } from 'shoukaku';
import { config } from 'dotenv';
import { registerCommands } from './commands';
import { registerEvents } from './events';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

const nodes = [{
  name: 'Main',
  url: process.env.LAVALINK_HOST || 'localhost:2333',
  auth: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
  secure: false,
}];

export const kazagumo = new Kazagumo({
  defaultSearchEngine: 'youtube',
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  },
  plugins: [
    new Plugins.PlayerMoved(client),
    new Plugins.Filters(),
  ],
}, new Connectors.DiscordJS(client), nodes);

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
  registerCommands(client);
});

registerEvents(client, kazagumo);

client.login(process.env.DISCORD_TOKEN);