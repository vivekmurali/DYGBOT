module.exports = {
    name: 'ping',
    description: 'ping!',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Pong');
    },
};