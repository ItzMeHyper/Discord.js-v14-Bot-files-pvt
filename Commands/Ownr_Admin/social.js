const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("socials")
        .setDescription("View the Socials of my Creator!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Youtube")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://www.youtube.com`),
                    new ButtonBuilder()
                        .setLabel("Instagram")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://www.instagram.com"),
                    new ButtonBuilder()
                        .setLabel("Discord")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://www.discord.com"),
                    new ButtonBuilder()
                        .setLabel("Twitter")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://www.twitter.com"),
                    new ButtonBuilder()
                        .setLabel("GitHub")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://github.com")
                );
            const Response = new EmbedBuilder()
                .setTitle("♦️ Socials ♦️")
                .addFields([
                    { name: "📹 │ Youtube", value: `.`, inline: true },
                    { name: "📱 │ Instagram", value: `.`, inline: true },
                    { name: "💻 │ Discord", value: `.`, inline: true },
                    { name: "🐦 │ Twitter", value: `.`, inline: true },
                    { name: "💻 │ GitHub", value: `.`, inline: true }
                ])
                .setColor("Red")
                .setImage('https://i.pinimg.com/564x/6c/69/1c/6c691c9dd22559dce1ebb4a11b1e6d88.jpg')
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()

            interaction.reply({ embeds: [Response], components: [row] })
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