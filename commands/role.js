module.exports = {
    name: 'role',
    description: 'Shows the user\'s role',
    //args: true,
    execute(message, args){
        message.reply(`You are currently a ${message.member.highestRole.name}`)
    }
}