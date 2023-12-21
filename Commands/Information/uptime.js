const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Return my uptime')
        .setDMPermission(false),

    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client) {
        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60
        const milliseconds = parseInt((client.uptime % 1000) / 100)

        const Response = new EmbedBuilder()
            .setColor(0x008000)
            .setTitle(`🖥️ 🌐 - Bot is up for \n\n**\`${days}\`** Days, **\`${hours}\`** Hrs, **\`${minutes}\`** Min, **\`${seconds}\`** Sec, **\`${milliseconds}\`** Ms`)
            //.setDescription(`🖥️ 🌐 - Bot is up for **\`${days}\`** Days, **\`${hours}\`** Hrs, **\`${minutes}\`** Min, **\`${seconds}\`** Sec, **\`${milliseconds}\`** Ms`)
            //.addField("Uptime", days + "d " + hours + "h " + minutes + "m " + seconds + "." + milliseconds + "s", true)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username} #${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() })
        try {
            await interaction.reply({ embeds: [Response], ephemeral: false })
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
                ])
                .setFooter({ text: `Command -- ${interaction.commandName}` })
                .setTimestamp();
            client.channels.cache.get(process.env.ERRORCHANNEL_ID).send({ embeds: [errEmbed] })
        }
    },
};