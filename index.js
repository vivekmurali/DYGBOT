const fs = require("fs");
const {
    prefix
} = require("./botconfig.json");
const Discord = require("discord.js");
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const mongoose = require('mongoose');
const person = require('./models/user');

const bot = new Discord.Client();
const embed = new Discord.RichEmbed();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Connection to MongoDb using mongoose
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

mongoose.connect('mongodb://localhost/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, () => {
    console.log("Connected to db");
})


//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}


bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Bro Vivek is actually a god WOW");
    /*
    const defaultChannel = bot.guild.channels.get('636834564450549770');
    defaultChannel.sendMessage('Hello',{tts: true});
    */
});



bot.on("guildMemberAdd", member => {
    member.guild.channels.get('688772681176449074').send(`Welcome ${member.username}!`);
})



bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    //let prefix = botconfig.prefix;


    // Message counter 
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    person.find({
        discordId: message.author.id
    }, (err, data) => {
        if (err) throw err;
        if (data.length == 0) {
            console.log("User not found");
            const Person = new person({
                discordId: message.author.id,
                name: message.author.username
            });
            Person.save();
        } else {
            if (message.author.id != '312279982422622208') {
                if (data[0].msgCount > 50) {
                    message.member.addRole('706953717361934336');
                    message.reply(`You've been promoted to gentleman ${message.author.username}`);
                } //Gentleman
                else if (data[0].msgCount > 100) {
                    message.member.addRole('706953712081436722');
                    message.member.removeRole('706953717361934336');
                    message.reply(`You've been promoted to Baron ${message.author.username}`);
                } //Baron
                else if (data[0].msgCount > 150) {
                    message.member.addRole('706619401834594384');
                    message.member.removeRole('706953712081436722');
                    message.reply(`You've been promoted to Count ${message.author.username}`);
                } //Count
                else if (data[0].msgCount > 250) {
                    message.member.addRole('706953343297126431');
                    message.member.removeRole('706619401834594384');
                    message.reply(`You've been promoted to Duke ${message.author.username}`);
                } //Duke
                else if (data[0].msgCount > 500) {
                    message.member.addRole('706953258098491465');
                    message.member.removeRole('706953343297126431');
                    message.reply(`You've been promoted to Archduke ${message.author.username}`);
                } //Archduke
                else if (data[0].msgCount > 750) {
                    message.member.addRole('706619615530319953');
                    message.member.removeRole('706953258098491465');
                    message.reply(`You've been promoted to King ${message.author.username}`);
                } //KING
                else if (data[0].msgCount > 1000) {
                    message.member.addRole('706953153664516265');
                    message.member.removeRole('706619615530319953');
                    message.reply(`You've been promoted to High King ${message.author.username}`);
                } //High King
            }


            person.findByIdAndUpdate(data[0]._id, {
                msgCount: data[0].msgCount + 1
            }, err => err)
        }
    })
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!bot.commands.has(commandName)) return;

    const command = bot.commands.get(commandName) ||
        bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        return message.reply('that\'s not a valid command!');
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author.username}!`;
        if (command.usage) {
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
        let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (message.member.roles.some(role => ['KING'].includes(role.name))) {
            expirationTime = 0;
        }
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    if (message.member.roles.some(role => ['KING'].includes(role.name))) {} else {
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }





    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`there was an error trying to execute ${commandName} :(`);
    }


});

bot.login(token);