/////////////////////////////////OLd one//////////////////////////////////////////

function loadErrhandler(client) {
  const { Discord, EmbedBuilder } = require("discord.js")

  const errChannel = "1060203332347629648"

  process.on('unhandledRejection', (reason, p) => {
    try {
      console.log(" [Anti-crash] :: Unhandle Rejection/Catch")
      console.log(reason, p)

      const errEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⚠️ New Error")
        .setDescription("An error just occured in the bot console!-unhandleRejection**\n\nERROR:\n\n**```" + reason + "\n\n" + p + "```")
        .setTimestamp()
        .setFooter({ text: `Anti-Crash System` });

      client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    } catch (err) {
      console.error('Error handling unhandled rejection:', err)
    }
  })

  process.on('uncaughtException', (err, origin) => {
    try {
      console.log(" [Anti-crash] :: Unhandle Exception/Catch")
      console.log(err, origin)

      const errEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⚠️ New Error")
        .setDescription("An error just occured in the bot console!-uncaughtException**\n\nERROR:\n\n**```" + err + "\n\n" + origin + "```")
        .setTimestamp()
        .setFooter({ text: `Anti-Crash System` });

      client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    } catch (err) {
      console.error('Error handling uncaught exception:', err)
    }
  })

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    try {
      console.log(" [Anti-crash] :: Unhandle Exception/Catch (MONITOR)")
      console.log(err, origin)

      const errEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⚠️ New Error")
        .setDescription("An error just occured in the bot console!-monitor**\n\nERROR:\n\n**```" + err + "\n\n" + origin + "```")
        .setTimestamp()
        .setFooter({ text: `Anti-Crash System` });

      client.channels.cache.get(errChannel).send({ embeds: [errEmbed] })
    } catch (err) {
      console.error('Error handling uncaught exception monitor:', err)
    }
  })


  /*process.on('multipleResolves', (type, promise, reason) => {
try {
    console.log(" [Anti-crash] :: Multiple Resolves")
    console.log(type, promise, reason)

    const errEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("⚠️ New Error")
      .setDescription("An error just occured in the bot console!-multipleresolves**\n\nERROR:\n\n**```" + type + "\n\n" + promise + "\n\n" + reason + "```")
      .setFooter({ text: `Anti-Crash System` })
      .setTimestamp()

    client.channels.cache.get(errChannel).send({ embeds: [errEmbed] });
    } catch (err) {
      console.error('Error handling Multiple Resolves:', err)
    }
  */
}

module.exports = { loadErrhandler }