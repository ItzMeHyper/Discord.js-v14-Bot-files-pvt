const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

const featuresDB = require('../../Models/Features')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .setDescription("Setup some settings!")
        .addSubcommand(
            command =>
                command.setName("levels")
                    .setDescription("Enable or disable the levels!")
                    .addStringOption(
                        option =>
                            option.setName("turn")
                                .setDescription("Enable or Disable the level System")
                                .addChoices(
                                    { name: "On", value: "on" },
                                    { name: "Off", value: "off" },
                                ))),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const channel = options.getChannel("channel")
        const role = options.getRole("role")
        const type = options.getString("configuration")

        const sub = options.getSubcommand();

        const Response = new EmbedBuilder()
            .setColor(0x50a919)
            .setTitle("✨ Setup")
            .setTimestamp(Date.now())
            .setDescription("Here can you see your current settings!")

        switch (sub) {
            case "levels": {

                const background = options.getString("background");
                const level_enabled = await featuresDB.findOne({ GuildID: guild.id });
                if (level_enabled) {
                    const { LevelSystem } = level_enabled;

                    if (background) {
                        if (isValidHttpUrl(background)) {
                            await featuresDB.findOneAndUpdate(
                                { GuildID: guild.id },
                                {
                                    LevelSystem: {
                                        Enabled: LevelSystem ?
                                            LevelSystem.Enabled :
                                            false,
                                        Background: background
                                    }
                                },
                                { new: true, upsert: true }
                            )

                            Response
                                .setDescription("🖼️ New Background set!")
                                .setImage(background);
                        } else {
                            Response.setDescription("❌ `background` needs to be a valid link!")
                            return interaction.reply({ embeds: [Response], ephemeral: true })
                        }
                    }
                    switch (options.getString("turn")) {

                        case "on": {
                            await featuresDB.findOneAndUpdate(
                                { GuildID: guild.id },
                                { LevelSystem: { Enabled: true, Background: LevelSystem ? LevelSystem.Background : "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png" } },
                                { new: true, upsert: true })

                            Response.setDescription("✅ Successfully enabled the levels system!")
                        }
                            break;

                        case "off": {
                            await featuresDB.findOneAndUpdate(
                                { GuildID: guild.id },
                                { LevelSystem: { Enabled: true, Background: LevelSystem ? LevelSystem.Background : "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png" } },
                                { new: true, upsert: true })
                            Response.setDescription("✅ Successfully disabled the levels system!")
                        }
                            break;
                    }
                } else {
                    await featuresDB.findOneAndUpdate(
                        { GuildID: guild.id },
                        { LevelSystem: { Enabled: false, Background: "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png" } },
                        { new: true, upsert: true })
                    Response.setDescription("Set up the Level System, use `/setup levels turn: On` to turn it on, \n or use `/setup levels background: 'url'` to change the rankcard background!");
                }
            }
                break;
        }
        await interaction.reply({ embeds: [Response], ephemeral: true })
    }
};

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false
    }

    return url.protocol === "https:" || url.protocol === "http:";
};