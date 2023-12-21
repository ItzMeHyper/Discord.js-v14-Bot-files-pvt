const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const DB = require("../../Models/AFKSystem")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("Set yourself away from keyboard!")
        .addSubcommand(
            command =>
                command.setName("set")
                    .setDescription("Set your AFK status!")
                    .addStringOption(
                        option =>
                            option.setName("status")
                                .setDescription("Set your status message!")
                                .setRequired(true)
                    )
        )
        .addSubcommand(
            command =>
                command.setName("return")
                    .setDescription("Return from being afk!")),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        try {
            const { guild, user, createdTimestamp, options } = interaction;

            const Response = new EmbedBuilder()
                .setTitle("💤 AFK System")
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })

            const afkStatus = options.getString("status")
            switch (options.getSubcommand()) {
                case "set": {
                    await DB.findOneAndUpdate(
                        { GuildID: guild.id, UserName: user.tag, UserID: user.id },
                        { Status: afkStatus, Time: parseInt(createdTimestamp / 1000) },
                        { new: true, upsert: true }
                    )

                    Response.setColor("Random").setDescription(`✅ Your AFK status has been updated to ${afkStatus}.`);

                    return interaction.reply({ embeds: [Response], ephemeral: true })
                }
                    break;

                case "return": {
                    await DB.deleteOne({ GuildID: guild.id, UserName: user.tag, UserID: user.id });

                    Response.setColor("Random").setDescription(`❌ Your AFK status has been removed.`);

                    return interaction.reply({ embeds: [Response], ephemeral: true })
                }
                    break;
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