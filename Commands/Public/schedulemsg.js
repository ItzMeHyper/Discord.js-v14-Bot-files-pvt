const { SlashCommandBuilder,  EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schmsg")
        .setDescription("Send a bug report to the bot devs")
        .setDMPermission(false),

    async execute(interaction, client) {

        const modal = new ModalBuilder()
        .setTitle(`Schedule a message.`)
        .setCustomId('schmsg')


        const date = new TextInputBuilder()
        .setCustomId('date')
        .setRequired(true)
        .setPlaceholder('Date Format - (DD-MM-YYYY), eg-[09-08-2022]')
        .setLabel('DATE - (DD-MM-YYYY) eg-[09-08-2022].')
        .setStyle(TextInputStyle.Short); 

        const time = new TextInputBuilder()
        .setCustomId('time')
        .setRequired(true)
        .setPlaceholder('Time Format - (HH:MM), eg-[22:05].')
        .setLabel('TIME 24hr format (HH:MM) eg-[22:05].')
        .setStyle(TextInputStyle.Short); 

        const message = new TextInputBuilder()
        .setCustomId('message')
        .setRequired(true)
        .setPlaceholder('Please only state the command name')
        .setLabel('What command has a bug or has been abused')
        .setStyle(TextInputStyle.Paragraph);
       

        const one = new ActionRowBuilder().addComponents(date)
        const two = new ActionRowBuilder().addComponents(time)
        const three = new ActionRowBuilder().addComponents(message)
        
        modal.addComponents(one, two, three);
        await interaction.showModal(modal)

    },
};