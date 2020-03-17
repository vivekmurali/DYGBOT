module.exports={
    name: 'roll',
    description: 'Roll a dice',
    cooldown: 5,
    execute(message, args){
        let num = Math.floor(Math.random() * 6) + 1;
        message.channel.send(num);
    }
}