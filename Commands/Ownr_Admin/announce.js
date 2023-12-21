const { SlashCommandBuilder } = require("@discordjs/builders")
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Make an Announcemnet in your Server")
        .addStringOption((option) =>
            option
                .setName("about")
                .setDescription("Heading/Topic")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("announcement")
                .setDescription("Announcement content")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel to Send announcement")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("thumbnail_link")
                .setDescription("Thumbnail for announcement")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("image_link")
                .setDescription("Image for announcement")
                .setRequired(false)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        try {
            const topic = interaction.options.getString("about")
            const announce = interaction.options.getString("announcement")
            const thumbnail = interaction.options.getString("thumbnail_link")
            const image = interaction.options.getString("image_link")
            const destination =
                interaction.options.getChannel("channel") || interaction.channel

            let announceEmbed = new EmbedBuilder()
                .setTitle(`New Server Announcement`)
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .addFields(
                    { name: `${topic}\n`, value: `${announce}\n`, inline: true },
                )
                .setThumbnail(thumbnail)
                .setImage(image)
                .setColor("Gold")
                .setFooter({
                    text: `Announcement by ${interaction.user.username}`
                })
                .setTimestamp();

            let anembed = new EmbedBuilder()
                .setTitle("Done!")
                .setDescription(`📢 Announcement has been sent to ${destination}`)
                .setColor(0xFF0000);


            await interaction.reply({ embeds: [anembed], ephemeral: true }).catch((err) => { })
            destination.send({ embeds: [announceEmbed] }).catch((err) => {
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