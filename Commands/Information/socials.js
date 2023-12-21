const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("social")
        .setDescription("Social medias")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("youtube")
                .setDescription("View info of a user; leave blank to view your own")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("instagram")
                .setDescription("View the avatar of a user; leave blank to view your own")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("discord")
                .setDescription("View the avatar of a user; leave blank to view your own")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("twitter")
                .setDescription("View info of a user; leave blank to view your own")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("github")
                .setDescription("View info of a user; leave blank to view your own")
        )
        .setDMPermission(false),

    async execute(interaction, client, args) {

        try {

            const Options = interaction.options.getSubcommand()
            switch (Options) {
                case "youtube": {
                    const youtubeEmbed = new EmbedBuilder()
                        .setTitle("Youtube")
                        .setURL('https://www.youtube.com')
                        .setColor("Red")
                        .setThumbnail("https://cdn.dribbble.com/users/26599/screenshots/1293038/media/5f6b48ea1bd9c3588659732505ccb4d7.gif")
                        .addFields([
                            { name: "Check out my youtube channel", value: `Subscribe to yt`, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();
                    return await interaction.reply({ embeds: [youtubeEmbed], })
                        .catch((err) => { })
                }
                case "instagram": {
                    const instaEmbed = new EmbedBuilder()
                        .setTitle("Instagram")
                        .setURL('https://www.instagram.com')
                        .setColor("Purple")
                        .setThumbnail('https://media.giphy.com/media/l41YmiCZ8HXvVl5M4/giphy.gif')
                        .addFields([
                            { name: "Find me on Instagram", value: `Follow & get updated`, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();

                    return await interaction.reply({ embeds: [instaEmbed], })
                        .catch((err) => { })
                }
                case "discord": {
                    const discordEmbed = new EmbedBuilder()
                        .setTitle("Discord")
                        .setURL('https://www.discord.com')
                        .setColor("Grey")
                        .setThumbnail('https://cdn.dribbble.com/users/1809003/screenshots/5662515/media/f201be6a2b568900f2d0c2a870b862d6.gif')
                        .addFields([
                            { name: "Join Discord", value: `server`, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();

                    return await interaction.reply({ embeds: [discordEmbed], })
                        .catch((err) => { })
                }
                case "twitter": {
                    const twitterEmbed = new EmbedBuilder()
                        .setTitle("Twitter")
                        .setURL('https://www.twitter.com')
                        .setColor("Blue")
                        .setThumbnail('https://media.giphy.com/media/SMKiEh9WDO6ze/giphy.gif')
                        //https://media.giphy.com/media/h2ejccV0wxvPnOch27/giphy.gif
                        .addFields([
                            { name: "Join Discord", value: `server`, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();

                    return await interaction.reply({ embeds: [twitterEmbed], })
                        .catch((err) => { })
                }
                case "github": {
                    const githubEmbed = new EmbedBuilder()
                        .setTitle("Github")
                        .setURL('https://github.com')
                        .setColor("DarkButNotBlack")
                        .setThumbnail('https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif')
                        .addFields([
                            { name: "Join Discord", value: `server`, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();

                    return await interaction.reply({ embeds: [githubEmbed], })
                        .catch((err) => { })
                }
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
                ])
                .setFooter({ text: `Command -- ${interaction.commandName}` })
                .setTimestamp();
            client.channels.cache.get(process.env.ERRORCHANNEL_ID).send({ embeds: [errEmbed] })
        }
    },
};