const { SlashCommandBuilder } = require("discord.js")
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactionrole")
        .setDescription("Admin Command Pls Do not use this")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {Client} client
     */
    async execute(interaction, client) {
        const blueEmoji = '💙';
        const yellowEmoji = '💛';
        const redEmoji = '❤️';
        const greenEmoji = '💚';

        let reactionEmbed = new EmbedBuilder()
            .setTitle(`REACTION ROLE`)
            .setDescription('REACT TO OBTAIN A ROLE')
            .setColor('DarkRed')

        let messageEmbed = await interaction.channel.send({ embeds: [reactionEmbed], ephemeral: false })
        messageEmbed.react(blueEmoji);
        messageEmbed.react(yellowEmoji);
        messageEmbed.react(redEmoji);
        messageEmbed.react(greenEmoji);
    },
};