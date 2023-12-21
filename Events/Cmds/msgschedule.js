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

        if (interaction.customId === 'schmsg') {
            const date = interaction.fields.getTextInputValue('date');
            const time = interaction.fields.getTextInputValue('time');
            const message = interaction.fields.getTextInputValue('message');

            // Combine date and time strings into a single date object
            const [day, month, year] = interaction.fields.getTextInputValue('date').split('-');
            const dateTime = new Date(`${year}-${month}-${day}T${time}:00`);

            // Check if scheduled time has already passed
            if (dateTime <= new Date()) {
                return await interaction.reply({ content: 'Scheduled time has already passed.', ephemeral: true });
            }
            // Schedule message to be sent at specified time
            setTimeout(() => {
                interaction.channel.send(message);
            }, dateTime - new Date());

            const textEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle('Message Scheduled Sucessfully')
                .addFields([
                    { name: 'Scheduled Message', value: message, inline: false },
                    { name: 'Scheduled Time:', value: `${time}`, inline: true },
                    { name: 'Scheduled Date:', value: `${date}`, inline: true }
                ])
                .setTimestamp();

            await interaction.reply({ embeds: [textEmbed], ephemeral: true });
            //await interaction.reply(`Message scheduled to be sent on ${date} at ${time}.`);

        }
    },
};