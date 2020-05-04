module.exports = {
    name: 'flip',
    description: 'flip a coin',
    cooldown: 5,
    execute(message, args) {
        if (Math.floor(Math.random() * 2) == 0) {
            message.channel.send("Heads");
        } else {
            message.channel.send("Tails");
        }

    }
}