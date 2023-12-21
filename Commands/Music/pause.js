const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause!")
        .setDMPermission(false),

    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(interaction);
        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(
                            `🚫 | You must be in a voice channel to use this command!`
                        ),
                ],
            });
        }
        if (
            interaction.guild.members.me.voice.channelId !==
            interaction.member.voice.channelId
        ) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(
                            `🚫 | You need to be on the same voice channel as the Bot!`
                        ),
                ],
            });
        }
        if (!queue) {
            const noembed = new EmbedBuilder()
                .setDescription(`There isn't any song playing now to PAUSE. Use **/play** to add some songs.`);
            return interaction.reply({ embeds: [noembed] });
        }
        if (!queue.paused) {
            queue.pause();
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Pause",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`⏸️ | Paused current playing song!`),
                ],
            });
        } else {
            const pausedembed = new EmbedBuilder()
                .setDescription(`Song is already paused`)
                .setColor("Random");
            return interaction.reply({ embeds: [pausedembed] });
        }
    },
};