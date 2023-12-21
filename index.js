const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder } = require("discord.js");
require('dotenv').config();
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction } = Partials;
process.env.TZ = 'Asia/Kolkata';
const { connect } = require("mongoose")
const mongoose = require("mongoose");
const prefix = '!';
const fs = require('fs');

const { renderToString } = require('react-dom/server');
const React = require('react');
const { Calendar } = require('react-calendar');
const { createElement } = React;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction]
});

client.commands = new Collection();
client.config = require("./config.json");
const { botMainColor, botErrorColor } = require('./config.json')
client.hexMainColor = botMainColor.replace('0x', "#");
const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const { loadErrhandler } = require("./Handlers/errHandler");

///////////////////////* Music System *//////////////////////////
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud');

client.distube = new DisTube(client, {
  leaveOnEmpty: true,
  nsfw: true,
  emitNewSongOnly: true,
  leaveOnFinish: true,
  plugins: [new SpotifyPlugin(), new SoundCloudPlugin()]
})
module.exports = client;
/////////////////////////////////////////////////////////////////////////
client.off('disconnect', () => {
  const channel = client.channels.cache.get('998193228799021166'); // replace CHANNEL_ID with the ID of the channel you want to send the message to
  if (channel) {
    channel.send('Bot has gone offline.');
  }
});

client.on('messageCreate', message => {
  if (message.content === '+ping') {
    message.channel.send(`🏓Latency is ${message.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
});
client.on("messageCreate", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "hoi") {
    message.channel.send('helooi')
  }
})

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'calendar') {
    const calendarComponent = createElement(Calendar);
    const calendarString = renderToString(calendarComponent);

    fs.writeFileSync('calendar.html', calendarString);

    message.channel.send({
      files: ['calendar.html']
    }).then(() => {
      fs.unlinkSync('calendar.html');
    }).catch(error => {
      console.error(error);
    });
  }
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'calendar2') {
    const calendarComponent = createElement(Calendar);
    const calendarString = renderToString(calendarComponent);

    fs.writeFileSync('calendar.html', calendarString);

    const codeBlock = '```html\n' + calendarString + '\n```';

    message.channel.send(codeBlock)
      .then(() => {
        fs.unlinkSync('calendar.html');
      })
      .catch(error => {
        console.error(error);
      });
  }
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  loadEvents(client);
  loadErrhandler(client);
  loadCommands(client);
})
  .catch((err) => console.log(err));
connect(process.env.DATABASE_TOKEN, {
})
  .then(() => console.log("Bot sucessfully connected to database."))
  .catch((err) => console.log(err));