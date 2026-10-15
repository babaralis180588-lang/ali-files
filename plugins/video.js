const axios = require('axios');

module.exports = {
  name: 'video',
  aliases: ['vdl', 'play'],
  category: 'downloader',
  description: 'video downloader',

  async execute(sock, msg, args, extra) {
    if (!args.length) {
      return extra.reply("Video ka naam likho\nEx: .video atif aslam");
    }
    try {
      await extra.react('⏳');
      let input = args.join(" ");
      let searchApi = `https://api.davidcyriltech.my.id/search/yt?query=${encodeURIComponent(input)}`;
      let search = await axios.get(searchApi);
      let result = search.data.result?.[0] || search.data.results?.[0];
      let videoUrl = result.url;
      let title = result.title;
      await extra.reply(`Search: ${title}`);

      let dlApi = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
      let { data } = await axios.get(dlApi);
      let dl = data.result.download_url;

      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: dl },
        caption: title
      }, { quoted: msg });

      await extra.react('✅');
    } catch (e) {
      extra.reply("Error: " + e.message);
    }
  }
};
