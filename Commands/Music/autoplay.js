const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription("Enable or disable autoplay")
        .setDMPermission(false),

    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        if (!voiceChannel) {
            return interaction.reply({ content: "Please join a voice channel!", ephemeral: true })
        }
        if (!queue) {
            const queueError = new EmbedBuilder()
                .setDescription("There is Nothing Playing")
                .setColor("Random")
            return interaction.reply({ embeds: [queueError] })
        }
        if  (interaction.guild.members.me.voice.channelId !==
        interaction.member.voice.channelId) {
            return interaction.reply({ content: "You are not on the same voice channel as me!", ephemeral: true })
        }
        const mode = client.distube.toggleAutoplay(interaction)
        return interaction.reply("Set autoplay mode to `" + (mode ? "On" : "Off") + "`")
    },
};