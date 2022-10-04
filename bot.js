// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// const eventsPath = path.join(__dirname,'events');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Create a new client instance
const client = new Client({ intents: [
                                        GatewayIntentBits.Guilds, 
                                        GatewayIntentBits.GuildMessages, 
                                        GatewayIntentBits.DirectMessages, 
                                        GatewayIntentBits.MessageContent, 
                                        GatewayIntentBits.DirectMessageTyping,
                                        GatewayIntentBits.GuildMessageTyping
                                    ] });
// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = require(filePath);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', message => {
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

client.on('typingStart', async typing => {
    if(typing.user.id == '250738681197887489'){
        // typing.channel.send('Ta gueule Renaud !');
    };
})

// Login to Discord with your client's token
client.login(token);

