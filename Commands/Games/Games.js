const { SlashCommandBuilder } = require('@discordjs/builders');

const Hangman = require('../../Game src/Hangman.js');
const TwoZeroFourEight = require('../../Game src/2048.js');
const Flood = require('../../Game src/Flood.js');
const Snake = require('../../Game src/Snake.js')
const MatchPairs = require('../../Game src/Matchpair.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Discord mini Games')
    .addSubcommand((subcommand) =>
      subcommand
        .setName("hangman")
        .setDescription("Starts a Hangman game.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("2048")
        .setDescription("Starts a 2048 game.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("flood")
        .setDescription("Starts a Flood game.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("snake")
        .setDescription("Starts a snake game.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("matchpairs")
        .setDescription("Starts a Matchpair game.")
    )

    .setDMPermission(false),

  async execute(interaction, client) {
    try {
      const Options = interaction.options.getSubcommand()
      switch (Options) {
        case "hangman": {
          const hangman = new Hangman({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Hangman',
              color: '#5865F2'
            }
          });
          hangman.startGame().catch((err) => { });
        }
          break;

        case "2048": {
          const twozerofoureight = new TwoZeroFourEight({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: '2048',
              color: '#5865F2'
            },
            emojis: {
              up: '⬆️',
              down: '⬇️',
              left: '⬅️',
              right: '➡️',
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          twozerofoureight.startGame().catch((err) => { });
        }
          break;

        case "flood": {
          const flood = new Flood({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Flood',
              color: '#5865F2',
            },
            difficulty: 13,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
            winMessage: 'You won! You took **{turns}** turns.',
            loseMessage: 'You lost! You took **{turns}** turns.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          flood.startGame().catch((err) => { });
        }
          break;

        case "snake": {
          const snake = new Snake({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Snake Game',
              overTitle: 'Game Over',
              color: '#5865F2'
            },
            emojis: {
              board: '⬛',
              food: '🍎',
              up: '⬆️',
              down: '⬇️',
              left: '⬅️',
              right: '➡️',
            },
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
            stopButton: 'Stop',
            timeoutTime: 60000,
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });

          snake.startGame().catch((err) => { });
        }
          break;

        case "matchpairs": {
          const matchpairs = new MatchPairs({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Match Pairs',
              color: '#5865F2',
              description: '**Click on the buttons to match emojis with their pairs.**'
            },
            timeoutTime: 60000,
            emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
            winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
            loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });

          matchpairs.startGame();
        }
          break;
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
