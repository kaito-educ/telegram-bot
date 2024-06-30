const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const moment = require('moment-timezone');
const path = require('path'); 
const cron = require('node-cron');
const ai = require('./eurix/ai.js');
const config = require("./config.json");
const express = require("express");

global.config = config;
const app = express();

const port = config.port;

app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});


const token = fs.readFileSync('token.txt', 'utf-8');
const bot = new TelegramBot(token, { polling: true });
const commands = loadCommands('./commands');


bot.on('message', handleMessage);


function loadCommands(commandsFolder) {
    const commandPath = path.join(__dirname, commandsFolder); 
    const commands = {};

    fs.readdirSync(commandPath).forEach(file => {
        if (file.endsWith('.js')) {
            const script = require(path.join(commandPath, file)); 
            const eurix = script.eurix;

            if (!eurix || !eurix.name || !eurix.description || !eurix.author || !eurix.category || !script.execute) { 
                console.error(`Invalid command file: ${file}`);
                return;
            }

            commands[eurix.name.toLowerCase()] = script;

            if (eurix.aliases && Array.isArray(eurix.aliases)) {
                eurix.aliases.forEach(alias => {
                    commands[alias.toLowerCase()] = script;
                });
            }
        }
    });

    return commands;
}

async function handleMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const messageText = msg.text;

    if (!messageText.startsWith(global.config.prefix)) {
        const aiResponse = await ai.getAIResponse(messageText);

        if (aiResponse) {
            bot.sendMessage(chatId, aiResponse);
        }
    } else {
        const [commandName, ...args] = messageText.slice(1).split(' ');

        const command = commands[commandName.toLowerCase()];

        if (command) {
            command.execute({ bot, chatId, userId, args, msg });
        } else {
            bot.sendMessage(chatId, `Command not found
Use ${global.config.prefix}help to display available commands`);
        }
    }
}

const l = Object.keys(commands).map(command => `${global.config.prefix} ${command}`).join('\n');

console.log(`command List \n${l}`)


app.listen(port, () => {
    console.log(`Today is: ${moment.tz("Asia/Manila").format(`dddd LL h:mm A`)}`);
});
