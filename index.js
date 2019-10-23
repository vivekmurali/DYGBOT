const fs = require("fs");
const { prefix} = require("./botconfig.json");
const Discord = require("discord.js");
var token = "NDUxODE4NjA2MzA1NzM4NzYy.XbDYig.-ZmCBycpXDLtM2YINcmK0UWOBlk" ;


const bot = new Discord.Client();
const embed = new Discord.RichEmbed();
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}


bot.on("ready", async() =>{
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Bro Vivek is actually a god WTF");
});



bot.on("message", async message =>{
    if(message.author.bot) return;
    if(message.channel.type == 'dm') return;
    //let prefix = botconfig.prefix;

    const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    if (!bot.commands.has(commandName)) return;

    const command = bot.commands.get(commandName);

    if(command.args && !args.length){
        let reply = `You didn't provide any arguments, ${message.author.username}!`;
        if(command.usage){
            reply += `\n The proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);




    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`there was an error trying to execute ${commandName} :(`);
    }


});

bot.login(token);