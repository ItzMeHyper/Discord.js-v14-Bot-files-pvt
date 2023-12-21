const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip!")
        .addNumberOption((option) =>
            option
                .setName("id")
                .setDescription("Number of song")
                .setRequired(false)
                .setAutocomplete(true)
        )
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
                .setDescription(`There isn't any other songs in the queue To Skip. Use **/play** to add some songs.`)
                .setColor("Random");
            return interaction.reply({ embeds: [noembed] });
        }
        if (!queue.autoplay && queue.songs.length === 1) {
            const noembed = new EmbedBuilder()
                .setDescription(`There is no next song./This is the last song in the queue!.`)
                .setColor("Random");
            return interaction.reply({ embeds: [noembed] });
        }

        const id = await interaction.options.getNumber("id");

        if (!id) {
            queue.skip();
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`⏩ | Skipped!`),
                ],
            });
        }

        if (id) {
            const songSkip = queue.songs[parseInt(id) - 1];
            await client.distube.jump(interaction, parseInt(id) - 1);
            try {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `⏩ | Moved to song with ID: ${id}: **${songSkip.name}**!`
                            ),
                    ],
                });
            } catch (err) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Random")
                            .setDescription(
                                `🚫 | Songs with ID not found: ${id}!`
                            ),
                    ],
                    ephemeral: true,
                });
            }
        }
    },

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const queue = await client.distube.getQueue(interaction);

        if (queue.songs.length > 25) {
            const tracks = queue.songs
                .map((song, i) => {
                    return {
                        name: `${i + 1}. ${song.name}`,
                        value: i + 1,
                    };
                })
                .slice(0, 25);
            const filtered = tracks.filter((track) =>
                track.name.startsWith(focusedValue)
            );
            await interaction.respond(
                filtered.map((track) => ({
                    name: track.name,
                    value: track.value,
                }))
            );
        } else {
            const tracks = queue.songs
                .map((song, i) => {
                    return {
                        name: `${i + 1}. ${song.name}`,
                        value: i + 1,
                    };
                })
                .slice(0, queue.songs.length);
            const filtered = tracks.filter((track) =>
                track.name.startsWith(focusedValue)
            );
            await interaction.respond(
                filtered.map((track) => ({
                    name: track.name,
                    value: track.value,
                }))
            );
        }
    },
};