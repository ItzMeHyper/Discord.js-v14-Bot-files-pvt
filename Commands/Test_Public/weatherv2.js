const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weatherv2')
        .setDescription('Get the current weather for a location.')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The location you want to get the weather for.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const location = interaction.options.getString('location');
            weather.find({ search: location, degreeType: 'C' }, function (err, result) {
                if (err) {
                    const errEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("⚠️ Error Occured ⚠️")
                        .setDescription("An error just occured in the bot console!**\n\nERROR:\n\n**```" + err + "```")
                        .setFooter({ text: `PATH - Weather command` })
                        .setTimestamp()
                    return interaction.channel.send({ embeds: [errEmbed], ephemeral: false })
                    // console.log(interaction.client, interaction, error);
                }
                if (!result) return interaction.channel.send({ content: `no_results_found` })
                if (!result === undefined || result.length === 0) {
                    let error2embed = new EmbedBuilder()
                        .setTitle("Error :cry:")
                        .setDescription("**Please enter a vaild location!**")
                        .setColor("Red")
                        .setTimestamp()
                    return interaction.reply({ embeds: [error2embed], ephemeral: true });
                }
                const current = result[0].current;
                const locationName = result[0].location.name;
                const temperature = current.temperature;
                const feelsLike = current.feelslike;
                const weatherType = current.skytext;
                const wind = current.winddisplay;
                const humidity = current.humidity;
                const date = current.date;
                const time = current.observationtime;
                const imageUrl = current.imageUrl;

                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`Weather for ${locationName}`)
                    .setThumbnail(imageUrl)
                    .setDescription(`${weatherType}`)
                    .addFields(
                        { name: 'Temperature', value: `${temperature}°C`, inline: true },
                        { name: 'Feels like', value: `${feelsLike}°C`, inline: true },
                        { name: 'Wind', value: `${wind}`, inline: true },
                        { name: 'Humidity', value: `${humidity}%`, inline: true },
                        { name: 'Date', value: `${date}`, inline: true },
                        { name: 'Time', value: `${time}`, inline: true },
                    );
                interaction.reply({ embeds: [embed] });
            })
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
                    { name: '🖥️ **ERROR:**', value: `\`\`\`md\n${err}\`\`\``, inline: true },
                    { name: '🖥️ **ERR:**', value: `\`\`\`md\n${err.message}\`\`\``, inline: true },
                    { name: '🖥️ **Event no:**', value: `\`\`\`md\n${lineNumber}\`\`\``, inline: true },
                    { name: '🖥️ **Path:**', value: `\`\`\`md\n${stack}\`\`\``, inline: true },
                ])
                .setFooter({ text: "PATH - weatherv2 Command" })
                .setTimestamp();
            return interaction.channel.send({ embeds: [errEmbed], ephemeral: false });
        }
    },
};
