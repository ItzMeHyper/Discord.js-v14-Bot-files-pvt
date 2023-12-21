const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles all songs currently in the queue.')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = await client.distube.getQueue(interaction);
        const embed = new EmbedBuilder();
        embed.setColor("Random");


        if (!queue || !queue.playing) {
            embed.setDescription(`There isn't any other songs in the queue. Use **/play** to add some more.`);
            return interaction.reply({ embeds: [embed] });
        }


        if (queue) {
            await queue.shuffle();
            embed.setDescription(`Successfully shuffled songs in the QUEUE!`);
            return interaction.reply({ embeds: [embed] });
        }
    },
};