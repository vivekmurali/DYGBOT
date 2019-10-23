module.exports = {
        name: 'hello',
        description: 'Says hello to the user',
        cooldown: 5,
        execute(message, args){
            message.channel.send(`Hello ${message.author.username}!`);
        },
};