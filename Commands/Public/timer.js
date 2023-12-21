const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timer")
        .setDescription("Set a timer")
        .addIntegerOption((option) =>
            option
                .setName("seconds")
                .setDescription("The time in seconds")
                .setMinValue(1)
                .setMaxValue(86400)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reminder")
                .setDescription("What to remind you about")
                .setRequired(true)
        )
        .setDMPermission(false),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        try {
            const seconds = interaction.options.getInteger("seconds");
            const reminder = interaction.options.getString("reminder");

            const timerEmbed = new EmbedBuilder()
                .setColor(0x008000)
                .setTitle("Timer Set")
                .setAuthor({
                    name: `${interaction.member.user.tag}'s Timer ⏱️`,
                    iconURL: interaction.member.displayAvatarURL({
                        size: 4096,
                        dynamic: true,
                    }),
                })
                .setThumbnail('https://cdn.dribbble.com/users/4547038/screenshots/14409221/media/1d9053a421f418cea1ecbe4403957b60.gif')
                .setDescription(
                    `In **${seconds} seconds**, I will remind you about **${reminder}**`
                )
                .setTimestamp();

            await interaction.reply({ embeds: [timerEmbed] });

            setTimeout(() => {
                const reminderEmbed = new EmbedBuilder()
                    .setColor(0x008000)
                    .setTitle("Timer Up!")
                    .setAuthor({
                        name: `${interaction.member.user.tag}'s Timer ⏱️`,
                        iconURL: interaction.member.displayAvatarURL({
                            size: 4096,
                            dynamic: true,
                        }),
                    })
                    .setDescription(`**${reminder}**\nTime set: **${seconds} seconds**`)
                    .setTimestamp()
                interaction.member.send(
                    `<@${interaction.member.id}>|<@${interaction.member.id}>The timer you set **${seconds} seconds** ago is up! Reminder: **${reminder}**`)
            }, seconds * 1000);

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
