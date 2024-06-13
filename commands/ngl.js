const axios = require("axios");

module.exports = {
  eurix: {
    name: "ngl",
    author: "Eugene Aguilar",
    description: "Send a message to the NGL chat",
    usage: "/ngl <username> | <count> | <message>",
    category: "spam"
  },

  execute: async function ({ bot, chatId, args }) {
    const content = args
      .join(" ")
      .split("|")
      .map((item) => item.trim());

    const username = content[0];
    const count = parseInt(content[1]);
    const message = content[2];

    if (!username || !message || isNaN(count) || count <= 0) {
      bot.sendMessage(chatId, "Invalid command usage. Usage: /ngl <username> | <count> | <message>");
      return;
    }

    try {
      const response = await axios.get(`https://eurix-api.replit.app/ngl/spam?username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}&count=${encodeURIComponent(count)}`);
      bot.sendMessage(chatId, `Sent ${count} messages to ${username}`);
    } catch (error) {
      bot.sendMessage(chatId, "An error occurred, please try again later.");
      console.error("Error in /ngl command:", error);
    }
  }
};