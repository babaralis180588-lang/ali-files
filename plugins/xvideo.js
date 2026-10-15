const axios = require('axios');

module.exports = {
  name: 'xvideo',
  aliases: ['xvdl', 'xv'],
  category: 'downloader',
  description: 'Xvideos downloader 18+',

  async execute(sock, msg, args, extra) {
    if (!args.length) {
      return extra.reply("❌ *Link bhejo*\n\nExample:\n.xvideo https://www.xvideos.com/video.xxxx/title");
    }

    if (!extra.isAgeRestricted && extra.isAgeRestricted!== undefined) {
      // agar apke bot me age check hai to
    }

    try {
      await extra.react('⏳');
      let url = args[0];

      // API
      let api = `https://api.davidcyriltech.my.id/download/xvideos?url=${url}`;
      let { data } = await axios.get(api);

      if (!data ||!data.result) return extra.reply("❌ Download fail, link sahi bhejo");

      let videoUrl = data.result.url || data.result.download_url;
      let title = data.result.title || "XVIDEO";

      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: videoUrl },
