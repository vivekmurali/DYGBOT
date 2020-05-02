module.exports = {
    name: 'flip',
    description: 'flip a coin',
    cooldown: 5,
    execute(message, args) {
        let a = (Math.floor(Math.random()*9)+1);
        if (a % 2 == 0) {
            message.channel.send("Heads");
        } else {
            message.channel.send("Tails");
        }

    }
}