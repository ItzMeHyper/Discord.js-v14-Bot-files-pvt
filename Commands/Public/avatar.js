const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Give Avatar of users')
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Whos Avatar")
                .setRequired(true)
        )
        .setDMPermission(false),

    /**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
    async execute(interaction, client, args) {
        const user = interaction.options.getUser("user")
        let avatar = user.avatarURL({ size: 256, dynamic: true });

        const avatarEmbed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(avatar)
            .setColor(0x008000)
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL()
            })
            .setTimestamp();
       await  interaction.reply({ embeds: [avatarEmbed] })
        client.channels.cache.get('998279325600186458').send(`**${interaction.user.tag} Requested ${user.tag}'s Avatar.. And provided ${user.tag}'s avatar**`);
    },
};