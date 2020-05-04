const person = require('../models/user');

module.exports = {
    name: 'count',
    description: 'Message count',
    cooldown: 15,
    execute(message, args) {
        person.find({discordId: message.author.id},(err,data) => {
            if(err) throw err;
            message.channel.send(data[0].msgCount);
        })
        
    },
};