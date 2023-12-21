const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('See information about this project'),

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Invite")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`),
                    new ButtonBuilder()
                        .setLabel("GitHub")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://github.com/brblacky/lavamusic"),
                    new ButtonBuilder()
                        .setLabel("Support")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.gg/gfcv94hDhv")
                );

            const mainPage = new EmbedBuilder()
                .setAuthor({ name: 'LavaMusic', iconURL: 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png' })
                .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
                .setColor(0x3498DB)
                .addFields([
                    { name: 'Creator', value: '[Blacky#6618](https://github.com/brblacky) And [Venom#9718](https://github.com/Venom9718/)', inline: true },
                    { name: 'Organization', value: '[Blacky](https://github.com/brblacky)', inline: true },
                    { name: 'Repository', value: '[Here](https://github.com/brblacky/lavamusic)', inline: true },
                    { name: '\u200b', value: `[LavaMusic](https://github.com/brblacky/lavamusic/) is [Blacky](https://github.com/brblacky) and [Venom](https://github.com/Venom9718)'s Was created by blacky and Venom. He really wants to make his first open source project ever. Because he wants more for coding experience. In this project, he was challenged to make project with less bugs. Hope you enjoy using LavaMusic!`, inline: true },
                ]);
            return interaction.reply({ embeds: [mainPage], components: [row] });
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