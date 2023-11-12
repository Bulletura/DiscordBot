// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials} = require('discord.js');
require("dotenv").config();
const fetch = require('node-fetch');

// Create a new client instance


const client = new Client({ intents: [
                                        GatewayIntentBits.Guilds, 
                                        GatewayIntentBits.GuildMessages, 
                                        GatewayIntentBits.DirectMessages, 
                                        GatewayIntentBits.MessageContent, 
                                        GatewayIntentBits.DirectMessageTyping,
                                        GatewayIntentBits.GuildMessageTyping,
                                        GatewayIntentBits.GuildMembers,
                                        GatewayIntentBits.GuildPresences,
                                    ],
                                partials: [
                                    Partials.Channel,
                                    Partials.Message
                                ] });
                                    

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    if(commandName === "lp") {

        if(interaction.options.get("input").value == null){
            interaction.reply("Summoner's name can't be empty")
        }

        const summonerName = interaction.options.get("input").value
        try {
            const summonerData = await fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summonerName, {
                method: "GET",
                headers: {
                    "X-Riot-Token": process.env.RIOT_API_TOKEN,
                },
            });

            if(!summonerData.ok){
                interaction.reply(`The summoner \`${summonerName}\` doesn't exist`)
                return;
            }
            
            const summonerDataJson = await summonerData.json();
            const summonerID = summonerDataJson['id'];
            const summonerRankData = await fetch("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+summonerID, {
                method: "GET",
                headers: {
                    "X-Riot-Token": process.env.RIOT_API_TOKEN,
                }
            });
            const summonerRankDataJSON = await summonerRankData.json();
            let result = [];
            result["Ranked_Solo"] = summonerRankDataJSON.filter((data) => data["queueType"] == "RANKED_SOLO_5x5")[0]
            result["Ranked_Flex"] = summonerRankDataJSON.filter((data) => data["queueType"] == "RANKED_FLEX_SR")[0]

            let messageEmbed = {
                color: 0x4752c4,
                title: result["Ranked_Solo"]["summonerName"],
                description: "Statistiques de " + result["Ranked_Solo"]["summonerName"],
                timestamp: new Date().toISOString(),
                thumbnail: {
                    url: `https://ddragon.leagueoflegends.com/cdn/13.22.1/img/profileicon/${summonerDataJson['profileIconId']}.png`,
                },
                fields: [
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false,
                    },
                    {
                        name: "Solo/Duo",
                        value: result["Ranked_Solo"]["tier"] + " " + result["Ranked_Solo"]["rank"] + "/" + result["Ranked_Solo"]["leaguePoints"] + "LP",
                        inline: true,
                    },
                    {
                        name: "Flex",
                        value: result["Ranked_Flex"]["tier"] + " " + result["Ranked_Flex"]["rank"] + "/" + result["Ranked_Flex"]["leaguePoints"] + "LP",
                        inline: true,
                    }
                ]
            }
            
            interaction.reply({embeds: [messageEmbed]})
        } catch(error) {
            console.error(error)
        }
    }
})

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

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

