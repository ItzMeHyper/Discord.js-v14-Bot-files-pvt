const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "Music",
  data: new SlashCommandBuilder()
    .setName("clearqueue")
    .setDescription("Clears the songs in the queue")
    .setDMPermission(false),

  async execute(interaction, client) {
    const queue = await client.distube.getQueue(interaction);

    if (!queue || !queue.playing)
      return interaction.reply("I’m currently not playing in this guild.");

    if (!queue) {
      const noembed = new EmbedBuilder()
        .setDescription(`There isn't any songs in the queue to clear. Use **/play** to add some songs.`);
      return interaction.reply({ embeds: [noembed] });
    }
    const id = await interaction.options.getNumber("id");
    if (!id) {
      queue.stop();
      const msg = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(`Removed all songs from the queue.`),
        ],
      });
    }
  },
};