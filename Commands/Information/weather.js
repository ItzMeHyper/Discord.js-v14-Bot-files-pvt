const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const { find } = require("weather-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("See today's weather in each area.")
        .addStringOption((option) =>
            option
                .setName("location")
                .setDescription("Loc/Place/City/Town")
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            const inputArea = interaction.options.get("location").value;
            if (!inputArea) return await interaction.channel.send({ content: `empty` })
            find({
                "search": inputArea,
                "degreeType": "C",
                "timeout": 5000,
            }, async (error, result) => {
                //if (error) return console.log(interaction.client, interaction, error);
                if (error) {
                    const errEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("⚠️ Error Occured ⚠️")
                        .setDescription("An error just occured in the bot console!**\n\nERROR:\n\n**```" + error + "```")
                        .setFooter({ text: `PATH - Weather command` })
                        .setTimestamp()
                    return interaction.channel.send({ embeds: [errEmbed], ephemeral: false })
                }
                if (!result) return await interaction.channel.send({ content: `no_results_found` })
                if (!result === undefined || result.length === 0) {
                    const error2embed = new EmbedBuilder()
                        .setTitle("Error :cry:")
                        .setDescription("**Please enter a vaild location!**")
                        .setColor("Red")
                        .setTimestamp()
                    return interaction.reply({ embeds: [error2embed], ephemeral: true });
                };
                const city = result[0];
                const current = city.current;
                const location = city.location;
                const forecast = city.forecast;

                switch (current.skytext, current.forecast) {
                    case "Clear":
                        current.skytext = "Clear Weather";
                        break;
                    case "Light Rain":
                        current.skytext = "Light Rain";
                        break;
                    case "Rain Showers":
                        current.skytext = "Rain Showers";
                        break;
                    case "Mostly Cloudy":
                        current.skytext = "Mostly Cloudy";
                        break;
                    case "Partly Sunny":
                        current.skytext = "Partly Sunny";
                        break;
                    case "Partly Cloudy":
                        current.skytext = "Partly Cloudy";
                        break;
                    case "Sunny":
                        current.skytext = "Sunny";
                        break;
                    case "Rain":
                        current.skytext = "Rain";
                        break;
                    case "Cloudy":
                        current.skytext = "Cloudy";
                        break;
                    case "Mostly Sunny":
                        current.skytext = "Mostly Sunny";
                        break;
                    case "Mostly Clear":
                        current.skytext = "Mostly Clear";
                        break;
                }
                const skyText = current.skytext;
                const imageURL = current.imageUrl;
                const obsertime = current.observationtime;
                const temperature = current.temperature;
                const feelsLike = current.feelslike;
                const wind = current.winddisplay;
                const humidity = current.humidity;
                const day = current.day;
                const date = current.date;
                const timezone = location.timezone;
                const degreeType = location.degreetype;
                const latitude = location.lat;
                const longitude = location.long;

                const weatherEmbed = new EmbedBuilder()
                    .setTitle(`Weather in __${current.observationpoint}__`)
                    .setDescription(`${city.location.name}`)
                    .setColor("Blue")
                    .setFooter({
                        text: `Requested by ${interaction.user.username} #${interaction.user.discriminator}`,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setThumbnail(imageURL)
                    .setImage(`https://wttr.in/${inputArea}.png?m`)
                    .addFields([
                        { name: 'Status', value: `\`\`\`${skyText}\`\`\``, inline: true },
                        { name: 'Degree Type', value: `\`\`\`${degreeType}\`\`\``, inline: true },
                        { name: '🌡️Temperature', value: `\`\`\`${temperature}°\`\`\``, inline: true },
                        { name: '✨Feels Like', value: `\`\`\`${feelsLike}°\`\`\``, inline: true },
                        { name: '🍃Wind', value: `\`\`\`${wind}\`\`\``, inline: true },
                        { name: '💧Humidity', value: `\`\`\`${humidity} %\`\`\``, inline: true },
                        { name: '📈High', value: `\`\`\`${forecast[1].high}°C\`\`\``, inline: true },
                        { name: '📉Low', value: `\`\`\`${forecast[1].low}°C\`\`\``, inline: true },
                        { name: '🗓️Date', value: `\`\`\`${date}\`\`\``, inline: true },
                        { name: '🗓️Day', value: `\`\`\`${day}\`\`\``, inline: true },
                        { name: '⌚Observation Time', value: `\`\`\`${obsertime}\`\`\``, inline: true },
                        { name: '🌐Latitude', value: `\`\`\`${latitude}°\`\`\``, inline: true },
                        { name: '🌐Longitude', value: `\`\`\`${longitude}°\`\`\``, inline: true },
                        { name: '⏲️Current Timezone', value: `\`\`\`UTC  ${timezone}\`\`\``, inline: true },
                        //{ name: '', value: `${}`, inline: true },
                    ]);
                interaction.reply({ embeds: [weatherEmbed] });
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