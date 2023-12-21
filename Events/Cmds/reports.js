const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, Client, CommandInteraction, InteractionType } = require("discord.js")
const { ButtonBuilder } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    rest: false,
    once: false,
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'bugreport') {
            const command = interaction.fields.getTextInputValue('command');
            const description = interaction.fields.getTextInputValue('description');

            const id = interaction.user.id;
            const member = interaction.member;
            const server = interaction.guild.id || 'NO server provided';

            const channel = await client.channels.cache.get(process.env.REPORTCHANNEL_ID);

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setThumbnail("https://cdn.dribbble.com/users/566033/screenshots/5415345/media/f1969a7aa5d19545fe7db27bd9e58dfb.gif")
                .setTitle(`Report from ${member.user.username} #${member.user.discriminator}`)
                .addFields({ name: "User", value: `${member}`, inline: true })
                .addFields({ name: "User ID", value: `${id}`, inline: false })
                .addFields({ name: "Server Name", value: `${interaction.guild.name}`, inline: true})
                .addFields({ name: "Server ID", value: `${server}`, inline: true })
                .addFields({ name: "Command Reported", value: `\`${command}\`` , inline: false})
                .addFields({ name: "Reported Issue/Description", value: `\`\`\`md\n${description}\`\`\``, inline: false })
                .setTimestamp()
                .setFooter({
                    text: `Report Bug System`
                })

            await channel.send({ embeds: [embed] })
            await interaction.reply({ content: `Your report has beeen submitted to devs`, ephemeral: true });

        }
    },
};