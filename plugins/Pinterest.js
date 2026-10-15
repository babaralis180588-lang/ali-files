const axios = require('axios');

module.exports = {
  name: 'pinterest',
  aliases: ['pin', 'pinvideo'],
  category: 'downloader',
  description: 'Pinterest downloader',

  async execute(sock, msg, args, extra) {
    if (!args.length) {
      return extra.reply("❌ Link bhejo\n\nExample:\n.pinterest https://pin.it/xxxx");
    }

    try {
      await extra.react('⏳');
      let api = `https://api.davidcyriltech.my.id/download/pinterest?url=${args[0]}`;
      let { data } = await axios.get(api);
      let mediaUrl = data.result.media || data.result.download_url;
      let type = data.result.type || "";

      if (type.includes('video') || mediaUrl.includes('.mp4')) {
        await sock.sendMessage(msg.key.remoteJid, {
          video: { url: mediaUrl },
          mimetype: 'video/mp4',
          caption: "*PINTEREST VIDEO*"
        }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, {
          image: { url: mediaUrl },
          caption: "*PINTEREST IMAGE*"
        }, { quoted: msg });
      }

      await extra.react('✅');
    } catch (e) {
      extra.reply("Error: " + e.message);
    }
  }
};
