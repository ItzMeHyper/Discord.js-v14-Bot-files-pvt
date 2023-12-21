const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get Bots Stats')
        .setDMPermission(false),

    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client) {
        try {
            cpuStat.usagePercent(function (err, percent, seconds) {
                if (err) {
                    return console.log(err);
                }
                const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
                const disk = os.freemem() / os.totalmem() * 100;
                //const vps = os.hostname();
                const boticon = client.user.displayAvatarURL();

                const statsEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription("**Bot's Stats:**")
                    .setTimestamp()
                    .setThumbnail(boticon)
                    .setColor(0x008000)
                    .setFooter({
                        text: `Requested by ${interaction.user.username} #${interaction.user.discriminator}`,
                        iconURL: interaction.user.avatarURL()
                    })
                    .addFields([
                        {
                            name: '💾 **Memory usage**', value: `\`\`\`md\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(
                                os.totalmem() / 1024 / 1024).toFixed(2)} MB\`\`\``, inline: true
                        },
                        { name: '💽 **CPU usage**', value: `\`\`\`md\n${percent.toFixed(2)} %\`\`\``, inline: true },
                        { name: '🖥️ **CPU**', value: `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``, inline: true },
                        { name: '💾 **Disk Usage**', value: `\`\`\`md\n${Math.round(disk * 100) / 100}%\`\`\``, inline: true },
                        { name: '🖥️ System', value: `\`\`\`md\n${os.arch()}\`\`\``, inline: true },
                        { name: '🖥️ Platform', value: `\`\`\`md\n${os.platform()}\`\`\``, inline: true },
                        { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
                        //{ name: 'VPS', value: `${vps}`, inline: true },
                        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
                        { name: 'Channels', value: `${client.channels.cache.size}`, inline: true },
                        { name: 'Commands Count', value: `${client.commands.size}`, inline: true },
                        { name: '📚Library', value: `\`Discord.js\``, inline: true },
                        { name: '📚Library Ver', value: `v${version}`, inline: true },
                        { name: '🧾 Node Ver', value: `${process.version}`, inline: true },
                        { name: '⏱Uptime', value: `${duration}`, inline: true },
                        { name: '🏓⏲️Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                        { name: '🗓️ Created On', value: `${client.user.createdAt}`, inline: true },
                    ])
                interaction.reply({ embeds: [statsEmbed] });
            });
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