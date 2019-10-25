module.exports={
    name: 'online',
    description: 'When used the bot will send a message saying it\'s online',
    cooldown: 60,
    execute(message, args){
        message.channel.send('The bot is now online');
    }
}