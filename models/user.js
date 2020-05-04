const mongoose = require('mongoose');

module.exports = mongoose.model('person', mongoose.Schema({
    discordId: Number,
    name: String,
    respect: {type: Number, default: 0},
    msgCount: {type: Number, default: 0},
    post: {type: Number, default: 0},
    rank: {type: Number, default: 0}
}))