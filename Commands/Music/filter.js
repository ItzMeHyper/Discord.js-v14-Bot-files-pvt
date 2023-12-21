const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: "Music",
    data: new SlashCommandBuilder()
        .setName("filter")
        .setDescription("Filter the queue")
        .addStringOption((option) =>
            option
                .setName("filter")
                .setDescription("Filter the queue")
                .setRequired(true)
                .addChoices(
                    { name: "off", value: "off" },
                    { name: "3d", value: "3d" },
                    { name: "bassboost", value: "bassboost" },
                    { name: "echo", value: "echo" },
                    { name: "karaoke", value: "karaoke" },
                    { name: "nightcore", value: "nightcore" },
                    { name: "surround", value: "surround" }
                )
        )
        .setDMPermission(false),

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const choices = [
            "off",
            "3d",
            "bassboost",
            "echo",
            "karaoke",
            "nightcore",
            "surround",
        ];
        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedValue)
        );
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },
    async execute(interaction, client) {
        const filter = interaction.options.getString("filter");
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
            .setDescription(`There is no song playing right now to set filter. Use **/play** to add some songs.`);
            return interaction.reply({ embeds: [noembed] });
        } 

        if (filter === "off" && queue.filters.size) queue.filters.clear();
        else if (Object.keys(client.distube.filters).includes(filter)) {
            if (queue.filters.has(filter)) queue.filters.remove(filter);
            else queue.filters.add(filter);
        }
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(`Filters \`${filter}\` have been added to the audio!`),
            ],
        });
    },
};
