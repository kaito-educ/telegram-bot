  const fs = require("fs");
  const path = require("path");
  const axios = require("axios");

  module.exports = {
    eurix: {
      name: "tikdl",
      description: "TikTok downloader",
      author: "Eugene Aguilar && tikvm api",
      usage: "tikdl <link>",
      category: "media",
    },
    execute: async ({ bot, chatId, args }) => {
      try {
        const link = args.join(" ");
        if (!link) {
          bot.sendMessage(chatId, "Please provide a Tiktok link");
          return;
        }

  bot.sendMessage(chatId, "🕥 downloading...");

        const response = await axios.get(`https://eurix-api.replit.app/tikdl?link=${encodeURIComponent(link)}`);
        const data = response.data.data;
        const { url: video, username, nickname, heart, comment, title, share, duration } = data;

        const videoPath = path.join(__dirname, "cache", "tiktok.mp4");

        const videoResponse = await axios.get(video, {
          responseType: "arraybuffer",
        });

        fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

        bot.sendVideo(chatId, fs.createReadStream(videoPath), { caption: `Downloaded Successfully\n\nUsername: ${username}\nNickname: ${nickname}\nHeart: ${heart}\nComment: ${comment}\nTitle: ${title}\nShare: ${share}\nDuration: ${duration}` });
      } catch (error) {
        bot.sendMessage(chatId, `${error}`);
      }
    }
  };