const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "fbdl",
    author: "Eugene Aguilar",
    description: "A simple Facebook video downloader",
    usage: "link", 
    category: "media",
  },

  execute: async function ({ bot, chatId, args }) {
    try {
      const link = args.join(" ");
      if (!link) {
        bot.sendMessage(chatId, `${global.config.prefix}fbdl <url>`);
        return;
      }

      bot.sendMessage(chatId, `🕥 Video is downloading. Please wait a minute...`);

      const res = await axios.get(`https://eurix-api.replit.app/fbdl?url=${encodeURIComponent(link)}`);
      const hd = res.data.hd;
      const title = res.data.title;

      const video = await axios.get(hd, { responseType: "arraybuffer" });

      const videoPath = path.join(__dirname, "cache", `fbdl.mp4`);

      fs.writeFileSync(videoPath, Buffer.from(video.data, "binary"));

      bot.sendVideo(chatId, fs.createReadStream(videoPath), { caption: `Title: ${title}` });
    } catch (error) {
      bot.sendMessage(chatId, `Error downloading the video. Please try again later.`);
      console.log(error);
    }
  }
};