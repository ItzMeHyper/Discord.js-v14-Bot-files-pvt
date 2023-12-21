const { EmbedBuilder } = require('discord.js');
const DB = require("../../Models/AFKSystem");

module.exports = {
    name: "messageCreate",
    once: false,
    /**
     * @param {Message} message
     */
    async execute(message) {
        if (message.author.bot) return;

        // await DB.deleteOne({ GuildID: message.guild.id, UserID: message.author.id });

        if (message.mentions.members) {
            const response = new EmbedBuilder().setColor(0xff5454);

            message.mentions.members.forEach(async (member) => {
                try {
                    const data = await DB.findOne({
                        GuildID: message.guild.id,
                        UserName: member.user.tag,
                        UserID: member.user.id,
                    });
                   // console.log('Data:', data)
                    if (data) {
                        response
                            .setTitle("AFK")
                            .setDescription(
                                `${member} went AFK <t:${data.Time}:R>\n **Status:** ${data.Status}`
                            );
                        await message.reply({ embeds: [response] });
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        }
    },
};
