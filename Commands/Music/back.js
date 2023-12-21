const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("back")
        .setDescription("Playback the played song!")
        .setDMPermission(false),

    async execute(interaction, client, args) {
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
                .setDescription(`There isn't any other songs in the queue. Use **/play** to add some more.`)
                .setColor("Random");
            return interaction.reply({ embeds: [noembed] });
        }
        if (!queue.previousSongs.length) {
            const noembed = new EmbedBuilder()
                .setDescription(`There is no previous song / Previous song not found`)
                .setColor("Random");
            return interaction.reply({ embeds: [noembed] });
        } try {
            await client.distube.previous(interaction);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Playback",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`🎵 |  Playing Previous Song!`),
                ],
            });

        } catch (err) {
            console.log(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Error",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(
                            `🚫 | The previous song in the playlist cannot be played back!`
                        ),
                ],
                ephemeral: true,
            });
        }
    },
};
