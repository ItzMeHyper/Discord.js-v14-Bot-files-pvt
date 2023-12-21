const { model, Schema } = require('mongoose')

module.exports = model("Features", new Schema({
    GuildID: String,
    LevelSystem: {
        Enabled: {
            type: Boolean,
            default: false,
        },
        Background: {
            type: String,
            default: "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png"
        }
    }
}))