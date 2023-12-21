const { Client, Message, MessageType, EmbedBuilder } = require('discord.js')

const featuresDB = require('../../Models/Features')
const levelDB = require('../../Models/LevelSystem')

const calculateXP = (level) => level * level * 100

module.exports = {
    name: "messageCreate",
    rest: false,
    once: false,
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        const { guild, member } = message
        if (!message.inGuild()) return;
        if (!member || member.user.bot) return; // Check if 'member' is null/undefined or if it's a bot user

        const levelSystemCheck = await featuresDB.findOne({ GuildID: guild.id })
        if (levelSystemCheck && levelSystemCheck.LevelSystem.Enabled) {
            addXP(member.user.username, guild.id, member.id, 5, message, client)
        }
    },
    calculateXP
}

/**
 * @param {Message} message 
 */
const addXP = async (username, guildId, userId, xpToAdd, message, client) => {
    const result = await levelDB.findOneAndUpdate({
        UserName: username,
        GuildID: guildId,
        UserID: userId
    }, {
        UserName: username,
        GuildID: guildId,
        UserID: userId,
        $inc: {
            xp: xpToAdd
        }
    }, {
        upsert: true,
        new: true
    })

    let { xp, level } = result
    const needed = calculateXP(level)

    if (xp >= needed) {
        level++
        xp -= needed

        const LevelEmbed = new EmbedBuilder()
            .setTitle("Level Up")
            .setDescription(`Congrats **${message.member.user.username}**! You are now __**Level ${level}**__ 🥳`)
            .setThumbnail(message.member.user.displayAvatarURL())
            .setColor("Blue")
            .setTimestamp(Date.now());

        message.reply({ embeds: [LevelEmbed] });

        await levelDB.updateOne({
            UserName: username,
            GuildID: guildId,
            UserID: userId,
        }, {
            level: level,
            xp: xp,
        })
    }
}