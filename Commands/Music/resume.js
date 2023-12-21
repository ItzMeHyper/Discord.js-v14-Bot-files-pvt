const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume!")
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
                .setDescription(`There is no song playing to RESUME. Use **/play** to add some songs.`);
            return interaction.reply({ embeds: [noembed] });
        }
        if (!queue.paused) {
            const resumedembed = new EmbedBuilder()
                .setDescription(`Song is already Playing`)
                .setColor("Random");
            return interaction.reply({ embeds: [resumedembed] });
        } else {
            queue.resume();
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Resume",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`⏯️ | Song Resumed sucessfully!`),
                ],
            });
        }
    },
};