module.exports = {
    name: 'rank',
    description: 'Shows the user\'s rank',
    //args: true,
    execute(message, args){
        message.reply(`You are currently a ${message.member.highestRole.name}`)
    }
}