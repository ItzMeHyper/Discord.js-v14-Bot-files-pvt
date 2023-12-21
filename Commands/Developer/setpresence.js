const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActivityType,
} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setpresence")
        .setDescription("Set my presence")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("status")
                .setDescription("Set my status")
                .addStringOption((option) =>
                    option
                        .setName("status")
                        .setDescription("The status to set to")
                        .setRequired(true)
                        .addChoices(
                            { name: "online", value: "online" },
                            { name: "idle", value: "idle" },
                            { name: "dnd", value: "dnd" },
                            { name: "invisible", value: "invisible" }
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("activity")
                .setDescription("Set my activity")
                .addIntegerOption((option) =>
                    option
                        .setName("activity")
                        .setDescription("The activity type to set to")
                        .setRequired(true)
                        .addChoices(
                            { name: "Playing", value: ActivityType.Playing },
                            { name: "Listening", value: ActivityType.Listening },
                            { name: "Watching", value: ActivityType.Watching },
                            { name: "Streaming", value: ActivityType.Streaming },
                            { name: "Competing", value: ActivityType.Competing }
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription("The activity name to set to")
                        .setRequired(true)
                )
        )
        .setDMPermission(false),
    developer: true,

    async execute(interaction, client) {
        //if (interaction.member.id !== "527285622809952256") {
        //return await interaction
        //.editReply({
        //	content: "Only admin can use this command",
        //	})
        //	.catch((err) => {})
        //}
        try {
            const Options = interaction.options.getSubcommand()

            switch (Options) {
                case "status": {
                    const status = interaction.options.getString("status")

                    await client.user.setStatus(status)

                    return await interaction
                        .reply({
                            content: `✅ | Updated status to **${status}**`,
                        })
                        .catch((err) => { })
                }

                case "activity": {
                    const activitytype = interaction.options.getInteger("activity")
                    const activityname = interaction.options.getString("name")

                    await client.user.setActivity({
                        name: activityname,
                        type: activitytype,
                    })

                    // Playing **e**
                    // Listening to **e**
                    // Watching **e**
                    // Playing **e** (live on twitch)
                    // Competing in **e**

                    let activity

                    if (activitytype === ActivityType.Playing) {
                        activity = "Playing"
                    } else if (activitytype === ActivityType.Listening) {
                        activity = "Listening to"
                    } else if (activitytype === ActivityType.Watching) {
                        activity = "Watching"
                    } else if (activitytype === ActivityType.Streaming) {
                        activity = "Playing"
                    } else if (activitytype === ActivityType.Competing) {
                        activity = "Competing in"
                    }

                    return await interaction
                        .reply({
                            content: `✅ | Updated activity to **${activity} ${activityname}**`,
                        })
                        .catch((err) => { });
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