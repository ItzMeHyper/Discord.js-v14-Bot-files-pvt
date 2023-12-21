const client = require('../../index.js')
const { Message, EmbedBuilder, Embed } = require('discord.js')
const guild = client.guilds.cache.get("995342969928429629");
client.on('messageReactionAdd', async (reaction, user) => {
    const guild = client.guilds.cache.get("995342969928429629");
    const channel = '1031557691887333436'
    const msgId = '1032553873468047371'
    const blueColorRole = guild.roles.cache.find(role => role.name === "Blue");
    const yellowColorRole = guild.roles.cache.find(role => role.name === "Yellow");
    const redColorRole = guild.roles.cache.find(role => role.name === "Red");
    const greenColorRole = guild.roles.cache.find(role => role.name === "Green");

    const blueEmoji = '💙';
    const yellowEmoji = '💛';
    const redEmoji = '❤️';
    const greenEmoji = '💚';

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.id === `${msgId}`) {
        if (reaction.emoji.name === blueEmoji || reaction.emoji.id === '1031557786364039218') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(blueColorRole);
            //user.send('You have recieved the Blue role!')
        }
        if (reaction.emoji.name === yellowEmoji || reaction.emoji.id === '1031557990442086462') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(yellowColorRole);
            //user.send('You have recieved the Yellow role!')
        }
        if (reaction.emoji.name === redEmoji || reaction.emoji.id === '1031980608206950452') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(redColorRole);
            //user.send('You have recieved the Red role!')
        }
        if (reaction.emoji.name === greenEmoji || reaction.emoji.id === '1032557958019686430') {
            await reaction.message.guild.members.cache.get(user.id).roles.add(greenColorRole);
            //user.send('You have recieved the Green role!')
        } else {
            return;
        }
    }
});

    //client.channels.cache.get('998279325600186458').send(`\`\`\`\**${interaction.user.tag} Has StartedReactionRole Command**\`\`\``);