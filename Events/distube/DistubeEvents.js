const { DisTube } = require("distube");
const client = require('../../index.js')
const { EmbedBuilder } = require("discord.js");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

const Format = Intl.NumberFormat();
let spotifyOptions = {
    parallel: true,
    emitEventsAfterFetching: false,
};
// const { getVoiceConnection }= require('@discordjs/voice');

client.distube = new DisTube(client, {
    leaveOnStop: false,
    leaveOnEmpty: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    // youtubeDL: false,
    // youtubeCookie: client.config.cookie,
    plugins: [new SpotifyPlugin(spotifyOptions), new SoundCloudPlugin()],
});


const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
    }\` | Repeat: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? "Playlist"
                : "Song"
            : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube.on("addSong", async (queue, song) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: "Add song to queue",
                    iconURL: client.user.avatarURL(),
                })
                .setDescription(`> [**${song.name}**](${song.url})`)
                .setThumbnail(song.user.displayAvatarURL())
                .addFields([
                    {
                        name: "⏱️ | Time",
                        value: `${song.formattedDuration}`,
                        inline: true,
                    },
                    {
                        name: "🎵 | Upload",
                        value: `[${song.uploader.name}](${song.uploader.url})`,
                        inline: true,
                    },
                    {
                        name: "👌 | Request by",
                        value: `${song.user}`,
                        inline: true,
                    },
                ])
                .setImage(song.thumbnail)
                .setFooter({
                    text: `${Format.format(queue.songs.length)} songs in queue`,
                }),
        ],
    });

    //setTimeout(() => {
      //  msg.delete();
    //}, 20000);
});

client.distube.on("addList", async (queue, playlist) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: "Add playlist to queue",
                    iconURL: client.user.avatarURL(),
                })
                .setThumbnail(playlist.user.displayAvatarURL())
                .setDescription(`> [**${playlist.name}**](${playlist.url})`)
                .addFields([
                    {
                        name: "⏱️ | Time",
                        value: `${playlist.formattedDuration}`,
                        inline: true,
                    },
                    {
                        name: "👌 | Request by",
                        value: `${playlist.user}`,
                        inline: true,
                    },
                ])
                .setImage(playlist.thumbnail)
                .setFooter({
                    text: `${Format.format(queue.songs.length)} songs in queue`,
                }),
        ],
    });

    setTimeout(() => {
        msg.delete();
    }, 20000);
});

client.distube.on("playSong", async (queue, song) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: "Now playing",
                    iconURL: client.user.avatarURL(),
                })
                .setDescription(`> [**${song.name}**](${song.url})`)
                .setThumbnail(song.user.displayAvatarURL())
                .addFields([
                    {
                        name: "🔷 | Status",
                        value: `${status(queue).toString()}`,
                        inline: false,
                    },
//
                    {
                        name: "⏱️ | Duration",
                        value: `${song.formattedDuration}`,
                        inline: true,
                    },
                    {
                        name: "👌 | Request by",
                        value: `${song.user}`,
                        inline: true,
                    },
                    {
                        name: "📻 | Playing music at",
                        value: `
┕🔊 | ${client.channels.cache.get(queue.voiceChannel.id)}
┕🪄 | ${queue.voiceChannel.bitrate / 1000}  kbps`,
                        inline: false,
                    },
                ])
                .setImage(song.thumbnail)
                .setFooter({
                    text: `${Format.format(queue.songs.length)} songs in queue`,
                }),
        ],
    });

    setTimeout(() => {
        msg.delete();
    }, 500000);
});

client.distube.on("empty", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setDescription(
                    `🚫 | The room is empty, the bot automatically leaves the room!`
                ),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 200000);
});

client.distube.on("error", async (channel, error) => {
    const msg = await channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setDescription(
                    `🚫 | An error has occurred!\n\n** ${error
                        .toString()
                        .slice(0, 1974)}**`
                ),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 200000);
});

client.distube.on("disconnect", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setDescription(`🚫 | The bot has disconnected from the voice channel!`),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 200000);
});

client.distube.on("finish", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setDescription(
                    `🚫 | All songs on the playlist have been played!`
                ),
        ],
    });
    //setTimeout(() => {
       // msg.delete();
   // }, 20000);
});

client.distube.on("initQueue", async (queue) => {
    queue.autoplay = false;
    queue.volume = 70;
});

client.distube.on("noRelated", async (queue) => {
    const msg = await queue.textChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("Random")
                .setDescription(`🚫 | Song not found!`),
        ],
    });
    setTimeout(() => {
        msg.delete();
    }, 20000);
});
