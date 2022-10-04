// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config();

// const eventsPath = path.join(__dirname,'events');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Create a new client instance
const client = new Client({ intents: [
                                        GatewayIntentBits.Guilds, 
                                        GatewayIntentBits.GuildMessages, 
                                        GatewayIntentBits.DirectMessages, 
                                        GatewayIntentBits.MessageContent, 
                                        GatewayIntentBits.DirectMessageTyping,
                                        GatewayIntentBits.GuildMessageTyping,
                                        GatewayIntentBits.GuildMembers,
                                        GatewayIntentBits.GuildPresences
                                    ] });
                                    

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', message => {
    if(message.guild === null){
        return;
    }
    if(message.author.id == client.user.id){
        if(message.content.includes('@everyone')){
            message.delete();
        }
    }

    let role = message.guild.roles.cache.find(r => r.name === "everylone");
    let newMessage = "";
	if (message.content.includes('@'+client.user.id)){
        newMessage = message.content.replace('<@'+client.user.id+">", '@everyone');
    }
    if (message.content.includes('@&'+role.id)){
        newMessage = message.content.replace('<@&'+role.id+">", '@everyone');
    }

    if(newMessage != ""){
        message.channel.send(newMessage);
    }
});

// client.on('typingStart', async typing => {
//     if(typing.user.id == '250738681197887489'){
//         // typing.channel.send('Ta gueule Renaud !');
//     };
// })

// client.on('userUpdate', (oldUser,newUser) => {
//     if(oldUser.id == "315156432100261899"){
//         // console.log(newUser.user);
//     }
// })
client.on('guildMemberUpdate', (oldUser,newUser) => {
    let Bulletura = client.users.cache.find(user => user.id == '356512651150360577');
    if(newUser.id == "315156432100261899"){
        console.log(newUser);
        if(newUser.avatar != null){
            Bulletura.send(newUser.avatar);
        }
        if(newUser.nickname == null){

            // Bulletura.send(newUser.user.username);
        } else{
            // Bulletura.send(newUser.nickname)
        }
        
    }
})
// client.on('presenceUpdate', (oldUser,newUser) => {
//     if(oldUser.id == "315156432100261899"){
//         // console.log(newUser.user);
        
//     }
// })

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

