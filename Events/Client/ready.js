const { Client } = require("discord.js");
const { activityInterval, guildId, database } = require("../../config.json")

module.exports = {
  name: "ready",
  rest: false,
  once: false,
  /**
   * @param {Client} client
   */
  async execute(client) {
    console.log(`${client.user.tag} is now online successfully!`);
    console.log(`Running on ${client.guilds.cache.size} Server!`);
    console.log("---------------------[READY]---------------------");
    client.channels.cache.get(process.env.LOG_CHANNEL_ID).send('|-------------------𝐁𝐎𝐓 𝐒𝐔𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐑𝐄𝐒𝐓𝐀𝐑𝐓𝐄𝐃-------------------|');
  },
};
 