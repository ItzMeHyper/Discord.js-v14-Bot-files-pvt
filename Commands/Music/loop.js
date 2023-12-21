const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the current song!")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("Choose the type of loop!")
                .setRequired(true)
                .addChoices(
                    { name: "Turn off repeat mode", value: "Turn off repeat mode" },
                    { name: "Repeat the song", value: "Repeat the song" },
                    { name: "Repeat song list", value: "Repeat song list" }
                )
        )
        .setDMPermission(false),

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const choices = [
            "Turn off repeat mode",
            "Repeat the song",
            "Repeat song list",
        ];
        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedValue)
        );
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },
    async execute(interaction, client) {
        const loop = interaction.options.getString("type");
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
            .setDescription(`There is no song playing right now to add loop. Use **/play** to add some songs.`);
            return interaction.reply({ embeds: [noembed] });
        } 

        if (loop === "Turn off repeat mode") {
            queue.setRepeatMode(0);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Repeat mode",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`🔁 | Repeat mode is now off!`),
                ],
            });
        } else if (loop === "Repeat the song") {
            queue.setRepeatMode(1);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Repeat mode",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`🔁 | Song loop mode is on!!`),
                ],
            });
        } else if (loop === "Repeat song list") {
            queue.setRepeatMode(2);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: "Repeat mode",
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(`🔁 | Playlist looping is enabled!!`),
                ],
            });
        }
    },
};
