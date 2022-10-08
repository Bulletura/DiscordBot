// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config();
const fetch = require('node-fetch');

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

client.on('messageCreate', async (message) => {
    
    if(message.content.slice(0,5) == '!kda '){
        let summonerName = message.content.substring(5);
        try{
            const summonerData = await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summonerName+"?api_key="+process.env.RIOT_API_TOKEN);
            const summonerDataJson = await summonerData.json();
            const summonerPUUID = summonerDataJson['puuid'];
            const matchIds = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"+summonerPUUID+"/ids?start=0&count=20&api_key="+process.env.RIOT_API_TOKEN);
            const matchIdsJson = await matchIds.json();
            Object.values(matchIdsJson).forEach(matchId => {
                
            });
            const match = await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6080010855?api_key="+process.env.RIOT_API_TOKEN);
            const matchJson = await match.json();
            let summonerGameData;
            console.log(matchJson['info']['participants'][0]['puuid']);
            Object.entries(matchJson['info']['participants']).forEach(entry => {
                const [key, value] = entry;
                console.log(value['puuid']);
                if(value['puuid'] == summonerPUUID){
                    summonerGameData = value;
                }
            })
            console.log(summonerGameData);
            message.channel.send(message.content.substring(5)+" KDA avec "+summonerGameData['championName']+" : "+summonerGameData['kills']+'/'+summonerGameData['deaths']+'/'+summonerGameData['assists']);
        } catch(error){
            
        }
    }
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

client.on('userUpdate', (oldUser,newUser) => {
    
    let Bulletura = client.users.cache.find(user => user.id == '356512651150360577');
    let Renaud = client.users.cache.find(user => user.id == '250738681197887489');
    let Max = client.users.cache.find(user => user.id == "347818967831805952");
    let Naiiver = client.users.cache.find(user => user.id == "163789689793413122");
    let Kinof = client.users.cache.find(user => user.id == "224158035390496791");
    if(oldUser == null){
        return;
    }
    if(oldUser.id == "793288364299124766"){
        Bulletura.send("Nouvelle photo de profile de Paulin :");
        Bulletura.send(newUser.displayAvatarURL());
        Renaud.send("Nouvelle photo de profile de Paulin :");
        Renaud.send(newUser.displayAvatarURL());
        Max.send("Nouvelle photo de profile de Paulin :");
        Max.send(newUser.displayAvatarURL());
        Naiiver.send("Nouvelle photo de profile de Paulin :");
        Naiiver.send(newUser.displayAvatarURL());
        Kinof.send("Nouvelle photo de profile de Paulin :");
        Kinof.send(newUser.displayAvatarURL());
    }
    if(oldUser.id == Bulletura.id){
        console.log(newUser);
    }
})
client.on('guildMemberUpdate', (oldUser,newUser) => {
    let Bulletura = client.users.cache.find(user => user.id == '356512651150360577');
    let Renaud = client.users.cache.find(user => user.id == '250738681197887489');
    if(oldUser.id == "250738681197887489"){
        console.log(newUser);
        if(newUser.avatar != null){
            Bulletura.send(newUser.avatar);
            Renaud.send(newUser.avatar);
        }
        if(newUser.nickname == null){

            // Bulletura.send(newUser.user.username);
        } else{
            // Bulletura.send(newUser.nickname)
        }
        
    }
})
client.on('presenceUpdate', (oldUser,newUser) => {
    
    let Bulletura = client.users.cache.find(user => user.id == '356512651150360577');
    let Renaud = client.users.cache.find(user => user.id == '250738681197887489');
    if(oldUser == null){
        return;
    }
    if(oldUser.id == "250738681197887489" || oldUser.id == Bulletura.id){
        console.log(newUser);
        console.log("presenceUpdate");
        console.log(newUser);
        
    }
})

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

