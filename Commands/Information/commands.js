const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("commands")
        .setDescription("Gets all the commands in server")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("cmds")
                .setDescription("View info of a user; leave blank to view your own")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("music")
                .setDescription("View the avatar of a user; leave blank to view your own")
        )
        .setDMPermission(false),

    async execute(interaction, client, args) {

        try {

            const Options = interaction.options.getSubcommand()

            switch (Options) {
                case "cmds": {

                    const Embed = new EmbedBuilder()
                        .setTitle("Loaded Commands")
                        .setColor("Random")
                        .setThumbnail('https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif')
                        .addFields([
                            { name: "/ping", value: `\`\`\`\Shows client ping\`\`\``, inline: true },
                            { name: "/uptime", value: `\`\`\`\Gives the bot uptime\`\`\``, inline: true },
                            { name: "/stats", value: `\`\`\`\Show Bot serever stats\`\`\``, inline: true },
                            { name: "/say", value: `\`\`\`\say something indirectly using bot\`\`\``, inline: true },
                            { name: "/socials", value: `\`\`\`\Gives social media links\`\`\``, inline: true },
                            { name: "/clear", value: `\`\`\`\Helps to clear messages\`\`\``, inline: true },
                            { name: "/about", value: `\`\`\`\About..\`\`\``, inline: true },
                            { name: "/weather", value: `\`\`\`\Shows weather of a location\`\`\``, inline: true },
                            { name: "/warn", value: `\`\`\`\Warns a user\`\`\``, inline: true },
                            { name: "/commands music", value: `\`\`\`\Shows all music commands\`\`\``, inline: true },
                            { name: "/jokes", value: `\`\`\`\Shows a random joke\`\`\``, inline: true },
                            { name: "/timer", value: `\`\`\`\Sets a timer\`\`\``, inline: true },
                            { name: "/voting", value: `\`\`\`\Helps to create a vote\`\`\``, inline: true }
                            // { name: "/voting", value: `\`\`\`\Helps to create a vote\`\`\``, inline: true }
                            //{ name: "/voting", value: `\`\`\`\Helps to create a vote\`\`\``, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();
                    return await interaction
                        .reply({
                            embeds: [Embed],
                        })
                        .catch((err) => { })
                }

                case "music": {
                    const Embed = new EmbedBuilder()
                        .setTitle("Music Commands")
                        .setColor("Random")
                        .setThumbnail('https://media.giphy.com/media/ZfiYf29HOVWT0ZnQLl/giphy.gif')
                        .addFields([
                            { name: "/play", value: `\`\`\`\Plays a song\`\`\``, inline: true },
                            { name: "/stop", value: `\`\`\`\Stops playing music\`\`\``, inline: true },
                            { name: "/setvolume", value: `\`\`\`\Increase or Decrease the volume\`\`\``, inline: true },
                            { name: "/skip", value: `\`\`\`\Skips the current song\`\`\``, inline: true },
                            { name: "/pause", value: `\`\`\`\Pauses the song\`\`\``, inline: true },
                            { name: "/resume", value: `\`\`\`\Resume the song\`\`\``, inline: true },
                            { name: "/queue", value: `\`\`\`\Gives the songs list in queue\`\`\``, inline: true },
                            { name: "/remove", value: `\`\`\`\Remove a specific song from the list\`\`\``, inline: true },
                            { name: "/shuffle", value: `\`\`\`\Shuffles the current queue\`\`\``, inline: true },
                            { name: "/nowplaying", value: `\`\`\`\Shows the current playing song\`\`\``, inline: true },
                            { name: "/loop", value: `\`\`\`\Option to loop songs/playlist\`\`\``, inline: true },
                            { name: "/filter", value: `\`\`\`\Add filter to audio\`\`\``, inline: true },
                            { name: "/back", value: `\`\`\`\Go back to previous song\`\`\``, inline: true },
                            { name: "/autoplay", value: `\`\`\`\Turns on/off autoplay\`\`\``, inline: true },
                            { name: "/clearqueue", value: `\`\`\`\Clears the song in the queue\`\`\``, inline: true }
                        ])
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();
                    return await interaction
                        .reply({
                            embeds: [Embed],
                        })
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
//https://media.giphy.com/media/ZfiYf29HOVWT0ZnQLl/giphy.gif
//https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif