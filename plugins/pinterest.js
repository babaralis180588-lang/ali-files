const { command } = require('../lib/nv-index');
const axios = require('axios');

command({
  pattern: "pinterest",
  alias: ["pinterestdl", "pindl", "Pin", "pinphoto", "pinimg", "pinterestphoto", "pinpic"],
  desc: "Pinterest Search & Downloader",
  category: "downloader",
  filename: __filename,
}, async (sock, m, { args, reply }) => {
  try {
    let input = args.join(" ").trim() || m.quoted?.text?.trim();
    if (!input) {
      return await reply(`*PINTEREST IMG*\n\n*COMMAND*\n\npinterest\npinterestdl\npindl\nPin\npinphoto\npinimg\npinterestphoto\npinpic\n\n*Use:*\n.pinterest girl dp\n.pinterest https://pin.it/72d9vY9\n.pinterest https://www.pinterest.com/pin/123/`);
    }

    await m.react("⏳");

    const isUrl = input.includes('pinterest.com') || input.includes('pin.it') || input.includes('https://');

    // ===== DOWNLOAD MODE =====
    if (isUrl) {
      let url = input.trim();
      let finalUrl = url;

      if (url.includes('pin.it')) {
        try {
          const res = await axios.get(url, { maxRedirects: 5, headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10000, validateStatus: () => true });
          finalUrl = res.request.res.responseUrl || res.request._redirectable._currentUrl || url;
        } catch {}
      }

      let mediaUrl = null;
      let isVideo = false;

      try {
        const { data: html } = await axios.get(finalUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept": "text/html" },
          timeout: 15000
        });
        const vMatch = html.match(/"video_url":"([^"]+\.mp4[^"]*)"/) || html.match(/"contentUrl":"([^"]+\.mp4[^"]*)"/) || html.match(/https:\/\/v1\.pinimg\.com\/videos\/[^"]+\.mp4/);
        if (vMatch) {
          mediaUrl = vMatch[1] ? vMatch[1].replace(/\\u002F/g, '/').replace(/\\/g, '') : vMatch[0];
          isVideo = true;
        }
        if (!mediaUrl) {
          const i1 = html.match(/"url":"(https:\/\/i\.pinimg\.com\/originals\/[^"]+\.(?:jpg|jpeg|png|webp))"/);
          if (i1) mediaUrl = i1[1].replace(/\\u002F/g, '/');
          else {
            const i2 = html.match(/"url":"(https:\/\/i\.pinimg\.com\/736x\/[^"]+\.(?:jpg|jpeg|png|webp))"/);
            if (i2) mediaUrl = i2[1].replace(/\\u002F/g, '/').replace('/736x/', '/originals/');
            else {
              const i3 = html.match(/https:\/\/i\.pinimg\.com\/originals\/[a-z0-9\/]+\.(?:jpg|jpeg|png)/i);
              if (i3) mediaUrl = i3[0];
            }
          }
        }
      } catch {}

      if (!mediaUrl) {
        await m.react("❌");
        return await reply("❌ Failed to fetch. Link private or expired.");
      }

      if (isVideo) {
        await sock.sendMessage(m.chat, { video: { url: mediaUrl }, caption: "📌 *PINTEREST IMAGE*\n\n| *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭* ⚡" }, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, { image: { url: mediaUrl }, caption: "📌 *PINTEREST IMAGE*\n\n| *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭* ⚡" }, { quoted: m });
      }
      await m.react("✅");
      return;
    }

    // ===== SEARCH MODE =====
    const query = input;
    let images = [];

    try {
      const res = await axios.get(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        timeout: 15000
      });
      const html = res.data;
      const regex = /https:\/\/i\.pinimg\.com\/originals\/[a-f0-9\/]+\.(?:jpg|jpeg|png|webp)/gi;
      const matches = [...html.matchAll(regex)];
      images = [...new Set(matches.map(mm => mm[0]))].slice(0, 10);
      if (images.length === 0) {
        const regex2 = /https:\/\/i\.pinimg\.com\/736x\/[a-f0-9\/]+\.(?:jpg|jpeg|png|webp)/gi;
        const m2 = [...html.matchAll(regex2)];
        images = [...new Set(m2.map(mm => mm[0].replace('/736x/', '/originals/')))].slice(0, 10);
      }
    } catch {}

    if (images.length === 0) {
      await m.react("❌");
      return await reply(`❌ No results for *${query}*`);
    }

    for (let i = 0; i < Math.min(5, images.length); i++) {
      try {
        await sock.sendMessage(m.chat, {
          image: { url: images[i] },
          caption: `📌 *PINTEREST IMAGE* ${i+1}/5\n\n| *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭* ⚡`
        }, { quoted: m });
        await new Promise(r => setTimeout(r, 700));
      } catch {}
    }
    await m.react("✅");

  } catch (e) {
    console.log(e.message);
    await m.react("❌");
    await reply("❌ Error processing request.");
  }
});
