const { Client, CommandInteraction, InteractionType } = require("discord.js");
const { ButtonBuilder } = require('discord.js');

module.exports = {
  name: "interactionCreate",
  rest: false,
  once: false,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    
    if(interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if(!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err)
        interaction.reply({content: `Something went wrong while executing this command.`, ephemeral: true})
      }

    } else if(interaction.isButton()) {
      if(!client.buttons) return new Error("No buttons defined!");
      
      const button = client.buttons.get(interaction.customId);
    
      if(!button) return new Error("There is no code for this button!");
    
      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if(interaction.type == InteractionType.ModalSubmit) {
      if(!client.modals) return new Error("No modals defined!");
      
      const modal = client.modals.get(interaction.customId);
    
      if(!modal) return new Error("There is no code for this modal!");
    
      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if(interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const modal = modals.get(interaction.customId)

      if(!modal) return new Error("There is no code for this modal!")

      try {
        await modal.execute(interaction, client)
      } catch (error) {
        console.error(error)
      }
    } else if(interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName)
      if(!contextCommand) return;

      try {
        await contextCommand.execute(interaction.client);
      } catch (error) {
        console.error(error);
      }
    }

  },
};