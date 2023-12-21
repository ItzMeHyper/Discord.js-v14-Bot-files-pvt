const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Member to warn")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason of the warn")
                .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client, Infraction) {
        try {
            const member = interaction.options.getMember("member")
            const user = interaction.options.getUser("member")
            const reason = interaction.options.getString("reason")

            const currenttime = Date.now()
            const randomid = Math.floor(Math.random() * 8989000) + 1010000
            const tag = await interaction.user.tag

            const Embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({
                    name: `${user.tag} have been warned`,
                    iconURL: member.displayAvatarURL({ size: 256, dynamic: true }),
                })
                .addFields([
                    { name: 'User -', value: `<@${member.id}>`, inline: false },
                    { name: 'Reason:', value: `\`\`\`${reason}\`\`\``, inline: false },
                    { name: 'Infraction ID', value: `${randomid}`, inline: true },
                    { name: 'Issued By:', value: `@${client.user.username}`, inline: true },
                ])
                .setThumbnail(
                    "https://images.emojiterra.com/twitter/v14.0/512px/26a0.png"
                )
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()

            await interaction.channel.send({
                embeds: [Embed]
            })
                .catch((err) => { })

            const logs = await client.channels.cache.get("955948174894325782")

            return await interaction.reply({
                content: `<@${member.id}> Has Been Warned`, ephemeral: true
            })
                .catch((err) => { })
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