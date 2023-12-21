const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js')
const { loadCommands } = require('../../Handlers/commandHandler')
const { loadEvents } = require('../../Handlers/eventHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload your events/command!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(
            command =>
                command.setName("events")
                    .setDescription("Reload your events!"))
        .addSubcommand(
            command =>
                command.setName("commands")
                    .setDescription("Reload your commands!"))
        .setDMPermission(false),
    developer: true,
    /**
     * @param { ChatInputCommandInteraction } interaction
     */
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();
        const Response = new EmbedBuilder()
            .setTitle("💻 Developer")
            .setColor(0x50a919)
        try {
            switch (sub) {
                case "commands": {
                    loadCommands(client);
                    interaction.reply({ embeds: [Response.setDescription("✅ Reloaded Commands!")] })
                }
                    break;

                case "events": {
                    loadEvents(client);
                    interaction.reply({ embeds: [Response.setDescription("✅ Reloaded Events!")] })
                }
                    break;
            }
        } catch (err) {
            const stack = err.stack.split('\n')[1].trim();
            const stackTrace = err.stack;
            const regex = /\((\S+)\)/;
            const match = regex.exec(stackTrace);
            const lineNumber = match ? match[1] : "unknown";
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("⚠️ Error Occurred ⚠️")
                .addFields([
                    { name: '🖥️ **ERROR:**', value: `\`\`\`md\n${err}\`\`\``, inline: false },
                    { name: '🖥️ **ERR:**', value: `\`\`\`md\n${err.message}\`\`\``, inline: true },
                    { name: '🖥️ **Event no:**', value: `\`\`\`md\n${lineNumber}\`\`\``, inline: true },
                    { name: '👤 **Triggered By:**', value: `\`\`\`md\n${interaction.user.username} #${interaction.user.discriminator}\`\`\``, inline: true },
                    { name: '🖥️ **Path:**', value: `\`\`\`${stack}\`\`\``, inline: true },
                    { name: '⌚ **Time:**', value: `\`\`\`${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\`\`\``, inline: true },
                ])
                .setFooter({ text: `Command -- ${interaction.commandName}` })
                .setTimestamp();
            client.channels.cache.get(process.env.ERRORCHANNEL_ID).send({ embeds: [errEmbed] })
        }

    },
};