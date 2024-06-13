const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  eurix: {
    name: "girledit",
    author: "Eugene Aguilar",
    description: "Generate random girl edit",
    category: "nonsense",
  },
  execute: async function ({ bot, chatId }) {
    try {
      bot.sendMessage(chatId, "🕥 video is sending please wait...");

      const response = await axios.get("https://girledit-api.replit.app/api/request/f");
      const video = response.data.data.video;
      const username = response.data.data.username;
      const nickname = response.data.data.nickname;
      const title = response.data.data.title;

      let videoPath = path.join(__dirname, "cache", "girledit.mp4");

      const videos = await axios.get(video, {
        responseType: "arraybuffer",
      });

      fs.writeFileSync(videoPath, Buffer.from(videos.data));

      bot.sendVideo(chatId, fs.createReadStream(videoPath), { caption: `Girl edit\n\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}` });
    } catch (error) {
      bot.sendMessage(chatId, `${error}`);
    }
  }
};