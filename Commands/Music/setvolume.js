const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("setvolume")
        .setDescription(
            "Change the volume of the currently playing song (0-100)!"
        )
        .addNumberOption(
            option =>
            option.setName("percent")
            .setDescription("10 = 10%")
            .setMaxValue(100)
            .setRequired(true)
        )
        .setDMPermission(false),
       

    async execute(interaction, client) {
        const volume = interaction.options.getNumber("percent")
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
        if (!queue){
            const noembed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`There is no song playing. Use **/play** to add some songs.`);
            return interaction.reply({ embeds: [noembed] });
        } 

        if (volume < 0 || volume > 100) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(
                            `🚫 | The volume value must be from 0 to 100!`
                        ),
                ],
                ephemeral: true,
            });
        }

        queue.setVolume(volume);
        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(
                        `✅ | The volume has been changed to: ${volume}%/100%`
                    ),
            ],
        });
    },
};
