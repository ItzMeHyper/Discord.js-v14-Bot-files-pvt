const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName("setchangelog")
        .setDescription("Create an update message for your bot users!")
        .addStringOption((option) =>
            option
                .setName("changelog")
                .setDescription("Create a changelog for your client")
                .setRequired(true))
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel to Send Update Log")
                .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;
        const destination =
            interaction.options.getChannel("channel") || interaction.channel

        let UpdateEmbed = new EmbedBuilder()
            .setTitle("🤖 Hyper Bot")
            .setURL("https://discord.gg")
            .setDescription(`There is a new Update for this Bot\n**Changelog:**\n${options.getString("changelog")}`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setColor("Yellow")
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();

        try {
            await interaction.reply({ content: "✅ Update sent successfully", ephemeral: true }).catch((err) => { })
            destination.send({ embeds: [UpdateEmbed] }).catch((err) => {
                console.log(err)

            })
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