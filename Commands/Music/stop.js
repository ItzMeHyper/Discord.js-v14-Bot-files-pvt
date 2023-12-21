const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop playing music")
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
            client.distube.voices.leave(interaction);
            const noembed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`🔇 | Stopped playing music!`);
            return interaction.reply({ embeds: [noembed] });
        }

        queue.stop();
        client.distube.voices.leave(interaction);
        const stopmsg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`🔇 | Stopped playing music!`),
            ],
        });
    },
};