const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../Developer/setname');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('head-tails')
        .setDescription('Your chance is going to be shown here!')
        .setDMPermission(false),

    async execute(interaction, client, config) {
        try {

            await interaction.reply({
                content: `\`•••\` Flipping...`
            });

            const arr = ["Head", "Tail", "Try Again", "Tail", "Head", "Try Again", "Head", "Tail"];

            const result = arr[Math.floor(Math.random() * arr.length)];

            setTimeout(() => {
                return interaction.editReply({
                    content: null,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Head or tails?')
                            .setDescription(`🪙 The result is... **${result}**!`)
                            .setColor('Blurple')
                    ]
                });
            }, 3500);
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