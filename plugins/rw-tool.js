// FINAL WORKING VERSION - bandah + cmd both support + menu me ayega
const { bandah, cmd } = require("../command");
const axios = require("axios");

const handler = async (conn, mek, m, { from, args, q, reply }) => {
  try {
    const query = (args && args.join(" ")) || q || "random nature";
    
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let imageUrl = null;
    let captionText = "";

    // Try 1: Wallhaven API - Best HD Wallpapers (Free)
    try {
      const res1 = await axios.get(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&sorting=random`, { timeout: 10000 });
      if (res1.data?.data?.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(res1.data.data.length, 10));
        imageUrl = res1.data.data[randomIndex].path;
        captionText = `🌌 *Random Wallpaper: ${query}*\n\n🔍 Source: Wallhaven HD\n> © Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓`;
      }
    } catch (e) {}

    // Try 2: Picsum HD Random - Always Works
    if (!imageUrl) {
      try {
        const randomId = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/1920/1080?random=${randomId}`;
        captionText = `🌌 *Random Wallpaper: ${query}*\n\n🔍 Source: Picsum HD\n> © Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓`;
      } catch (e) {}
    }

    // Try 3: Unsplash Direct - No API needed
    if (!imageUrl) {
      imageUrl = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(query)}`;
      captionText = `🌌 *Random Wallpaper: ${query}*\n\n🔍 Source: Unsplash\n> © Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓`;
    }

    // Try 4: Waifu for anime
    if (!imageUrl || query.toLowerCase().includes("anime")) {
      try {
        const res3 = await axios.get("https://api.waifu.pics/sfw/waifu", { timeout: 8000 });
        if (res3.data?.url) {
          imageUrl = res3.data.url;
          captionText = `🌌 *Random Wallpaper: ${query}*\n\n🔍 Source: Waifu.pics\n> © Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓`;
        }
      } catch (e) {}
    }

    if (imageUrl) {
      await conn.sendMessage(from, { 
        image: { url: imageUrl }, 
        caption: captionText 
      }, { quoted: mek });
      await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } else {
      reply(`❌ No wallpaper found for "${query}". Try:\n.rw nature\n.rw anime\n.rw car\n.rw city`);
    }

  } catch (error) {
    console.error("Wallpaper Error:", error);
    reply("❌ Error: " + error.message);
  }
};

// Register with bandah (for menu) and cmd (for old system) - Dono se kaam karega
bandah({
  pattern: "rw",
  alias: ["randomwall", "wallpaper", "wall", "wallpapers"],
  react: "🌌",
  desc: "Download random HD wallpapers",
  category: "utility",
  use: ".rw <keyword> - Eg: .rw nature, .rw anime, .rw car",
  filename: __filename
}, handler);

cmd({
  pattern: "rw",
  alias: ["randomwall", "wallpaper", "wall", "wallpapers"],
  react: "🌌",
  desc: "Download random HD wallpapers",
  category: "utility",
  use: ".rw <keyword>",
  filename: __filename
}, handler);
