const { Client, SlashCommandBooleanOption, SlashCommandBuilder,EmbedBuilder, ChatInputCommandInteraction, AttachmentBuilder } = require('discord.js')
const Canvacord = require('canvacord')
const { calculateXP } = require('../../Events/Message/levels')

const featuresDB = require('../../Models/Features')
const levelsDB = require('../../Models/LevelSystem')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("See your rank or the rank from other people! (The level System need to be enabled)")
        .addUserOption(
            option =>
                option.setName("member")
                    .setDescription("Member you want to see the rank")
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        try {
            const { options, guild, member } = interaction;

            const levelSystemCheck = await featuresDB.findOne({ GuildID: guild.id })
            if (levelSystemCheck) {
                const { LevelSystem } = levelSystemCheck
                if (!LevelSystem.Enabled) return interaction.reply({ content: `I'm sorry to say that to you, but <@${guild.ownerId}> didn't enabled the Level System 🙁`, ephemeral: true })

                const rankcard = new Canvacord.Rank()
                const user = options.getUser("member")
                const color = client.hexMainColor

                if (user) {
                    let levelResult = await levelsDB.findOne({ GuildID: guild.id, UserID: user.id });

                    if (levelResult && levelResult.xp) {
                        rankcard.setAvatar(user.displayAvatarURL({ size: 32, extension: 'png' }))
                            //Must be one of: 16, 32, 64, 128, 256, 512, 1024, 2048, 4096
                            .setCurrentXP(parseInt(`${levelResult.xp || "0"}`))
                            .setLevel(parseInt(`${levelResult.level || "1"}`))
                            .setProgressBar(color)
                            .setRequiredXP(calculateXP(levelResult.level))
                            .setOverlay("#000000", 1, false)
                            .setUsername(`${user.username}`)
                            .setDiscriminator(`${user.discriminator}`)
                            .setBackground('IMAGE', LevelSystem.Background || "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png")
                            .renderEmojis(true)
                            .setLevelColor(0x50a919)
                    } else {
                        return interaction.reply({ content: `${user} does not have any XP 🙁`, ephemeral: true })
                    }
                    client.channels.cache.get('998279325600186458').send(`**${interaction.user.tag}** Requested **${user.username}'s** Rank.. And provided **${user.username}'s** Rank Card`);
                } else {
                    let levelResult = await levelsDB.findOne({ GuildID: guild.id, UserID: member.user.id });

                    if (levelResult && levelResult.xp) {
                        rankcard.setAvatar(member.user.displayAvatarURL({ size: 32, extension: 'png' }))
                            //Must be one of: 16, 32, 64, 128, 256, 512, 1024, 2048, 4096
                            .setCurrentXP(parseInt(`${levelResult.xp}`) || 0)
                            .setLevel(parseInt(`${levelResult.level}` || 1))
                            .setRequiredXP(calculateXP(levelResult.level))
                            .setProgressBar(color)
                            .setOverlay("#000000", 1, false)
                            .setUsername(`${member.user.username}`)
                            .setDiscriminator(`${member.user.discriminator}`)
                            .setBackground('IMAGE', LevelSystem.Background || "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png")
                            .renderEmojis(true)
                            .setLevelColor(color)
                    } else {
                        return interaction.reply({ content: `You do not have any XP 🙁`, ephemeral: true })
                    }
                    client.channels.cache.get('998279325600186458').send(`**${interaction.user.tag}** Requested Their Rank.. And provided Their Rank Card`);
                }
                const img = rankcard.build()
                const atta = new AttachmentBuilder(await img).setName("rank.png")
                await interaction.reply('```🔃 Loading....```');
                //await wait(4000);
                await interaction.editReply({ content: `**Rank Card**`, files: [atta] });
            } else {
                return interaction.reply({ content: `I'm sorry to say that to you, but <@${guild.ownerId}> didn't enabled the Level System 🙁`, ephemeral: true })
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