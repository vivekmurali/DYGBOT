module.exports={
    name: 'roll',
    description: 'Roll a dice',
    cooldown: 5,
    execute(message, args){
        message.channel.send(Math.floor(Math.random() * 6) + 1);
    }
}