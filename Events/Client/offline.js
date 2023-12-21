const { Client } = require("discord.js");
const { activityInterval, guildId, database } = require("../../config.json")

module.exports = {
    name: "disconnect",
    rest: false,
    once: false,
    /**
     * @param {Client} client
     */
    async execute(client) {
      console.log(`${client.user.tag} is now online successfully!`);
      console.log(`Running on ${client.guilds.cache.size} Server!`);
      console.log("---------------------[𝐃𝐈𝐒𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃]---------------------");
      client.channels.cache.get(process.env.LOG_CHANNEL_ID).send('|-------------------𝐁𝐎𝐓 𝐃𝐈𝐒𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃-------------------|');
    },
  };