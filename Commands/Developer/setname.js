const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActivityType,
} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-name")
        .setDescription("Set the client\'s username.")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Set the client\'s username.")
                .setRequired(true)
        )
        .setDMPermission(false),
    developer: true,

    async execute(interaction, client) {
        /* if (interaction.member.id !== "527285622809952256") {
             return await interaction
                 .editReply({
                     content: "Only admin can use this command",
                 })
                 .catch((err) => { })
         }*/
        try {
            const nameInput = interaction.options.getString("name")

            await client.user.setUsername(nameInput);

            return interaction.reply({
                content: `\`✅\` Client\'s username has been changed to **${nameInput}**.`,
                ephemeral: true
            });
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
                interaction.channel.send({embeds: [errEmbed]})
            client.channels.cache.get(process.env.ERRORCHANNEL_ID).send({ embeds: [errEmbed] })
        }
    },
};