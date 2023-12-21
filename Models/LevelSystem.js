const { model, Schema } = require('mongoose')

module.exports = model("LevelSystem", new Schema({
    UserName: String,
    GuildID: String,
    UserID: String,

    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
}))