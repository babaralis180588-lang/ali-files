// ✅ TIKTOK + FB COMBINED - TIKTOK WORKING + NEW FB API - arslan-apis-v2

const axios = require("axios");
const { cmd } = require("../command");

// ✅ TIKTOK APIS - WORKING (Already fixed)
const TIKTOK_APIS = [
    {
        name: "tikwm.com",
        url: (q) => `https://www.tikwm.com/api/?url=${encodeURIComponent(q)}&count=12&cursor=0&web=1&hd=1`,
        parser: (data) => {
            if (data?.data) {
                let videoUrl = data.data.hdplay || data.data.play || data.data.wmplay;
                if (videoUrl && videoUrl.startsWith('/')) videoUrl = `https://www.tikwm.com${videoUrl}`;
                if (videoUrl && videoUrl.startsWith('http')) {
                    return {
                        videoUrl: videoUrl,
                        title: data.data.title || "TikTok Video",
                        author: data.data.author?.nickname || data.data.author?.unique_id || "Unknown",
                        username: data.data.author?.unique_id || "unknown",
                        meta: data.data
                    };
                }
            }
            return null;
        }
    },
    {
        name: "tiklydown.eu.org",
        url: (q) => `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(q)}`,
        parser: (data) => {
            if (data?.video?.noWatermark) {
                let videoUrl = data.video.noWatermark;
                if (videoUrl.startsWith('/')) videoUrl = `https://api.tiklydown.eu.org${videoUrl}`;
                return {
                    videoUrl: videoUrl,
                    title: data.title || "TikTok Video",
                    author: data.author?.name || "Unknown",
                    username: data.author?.unique_id || "unknown",
                    meta: data
                };
            }
            return null;
        }
    },
    {
        name: "agatz.xyz",
        url: (q) => `https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(q)}`,
        parser: (data) => {
            if (data?.data) {
                let videoUrl = data.data.no_watermark || data.data.watermark || data.data.play;
                if (videoUrl) {
                    if (videoUrl.startsWith('/')) videoUrl = `https://api.agatz.xyz${videoUrl}`;
                    return {
                        videoUrl: videoUrl,
                        title: data.data.title || "TikTok Video",
                        author: data.data.author?.nickname || "Unknown",
                        username: data.data.author?.unique_id || "unknown",
                        meta: data.data
                    };
                }
            }
            return null;
        }
    }
];

async function tryTiktokAPIs(query) {
    for (const api of TIKTOK_APIS) {
        try {
            const res = await axios.get(api.url(query), {
                timeout: 20000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/json',
                    'Referer': 'https://www.tikwm.com/'
                }
            });
            const parsed = api.parser(res.data);
            if (parsed?.videoUrl) return parsed;
        } catch (e) {
            console.log(`[${api.name}] failed:`, e.message);
            continue;
        }
    }
    return null;
}

// ================= FB - NEW API - arslan-apis-v2 =================

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok video - WORKING",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("🎯 Please provide a valid TikTok link!\n\nExample:\n.tt https://vt.tiktok.com/ZSq45WhDr/");

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const result = await tryTiktokAPIs(q);
        
        if (!result || !result.videoUrl) {
            return await reply("❌ All TikTok APIs failed! Try again later.");
        }

        let finalUrl = result.videoUrl;
        if (finalUrl.startsWith('/')) finalUrl = `https://www.tikwm.com${finalUrl}`;

        await conn.sendMessage(from, { 
            video: { url: finalUrl },
            mimetype: 'video/mp4',
            caption: `🎵 ${result.title}\n👤 *Author:* ${result.author}\n⚡ *Username:* @${result.username}\n\n> *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭 ✅*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .tiktok:", e);
        await reply("❌ Error occurred while downloading TikTok video!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

cmd({
    pattern: "tiktok2",
    alias: ["tt2", "ttdl2"],
    desc: "Download TikTok video",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("🎯 Please provide a valid TikTok link!\n\nExample:\n.tt2 link");
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        const result = await tryTiktokAPIs(q);
        if (!result || !result.videoUrl) return await reply("❌ Download failed! All APIs down.");
        let finalUrl = result.videoUrl;
        if (finalUrl.startsWith('/')) finalUrl = `https://www.tikwm.com${finalUrl}`;
        const meta = result.meta || {};
        await conn.sendMessage(from, { 
            video: { url: finalUrl },
            mimetype: 'video/mp4',
            caption: `🎵 *${result.title}*\n👤 *Author:* ${result.author}\n📱 *Username:* @${result.username}\n🌍 *Region:* ${meta.region || "N/A"}\n\n✨ *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭*`
        }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error("Error in .tiktok2:", e);
        await reply("❌ Error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

cmd({
    pattern: "tiktok3",
    alias: ["tt3", "ttdl3"],
    desc: "Download HD TikTok videos",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("🎯 Please provide a valid TikTok link!\n\nExample:\n.tt3 link ");
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        const result = await tryTiktokAPIs(q);
        if (!result || !result.videoUrl) return await reply("❌ Download failed! Try again later.");
        let finalUrl = result.videoUrl;
        if (finalUrl.startsWith('/')) finalUrl = `https://www.tikwm.com${finalUrl}`;
        const meta = result.meta || {};
        const stats = meta.stats || meta.statistics || {};
        const music = meta.music || {};
        const author = meta.author || {};
        const caption = `
🎬 *${result.title}*

👤 *Author:* ${author.nickname || result.author} (${author.unique_id || result.username})
🎵 *Music:* ${music.title || "N/A"}
💿 *By:* ${music.author || "N/A"}

📊 *Stats:*
   • Views: ${stats.playCount || stats.views || "N/A"}
   • Likes: ${stats.diggCount || stats.likes || "N/A"}
   • Shares: ${stats.shareCount || stats.shares || "N/A"}
   • Comments: ${stats.commentCount || stats.comments || "N/A"}

🌍 *Region:* ${meta.region || "N/A"}
🕒 *Duration:* ${meta.duration || meta.video?.duration || "N/A"}s

✨ *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭*
        `.trim();
        await conn.sendMessage(from, { video: { url: finalUrl }, mimetype: 'video/mp4', caption }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error("Error in .tiktok3:", e);
        await reply("❌ Error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// ================= FB - NEW WORKING API =================

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "Download Facebook video - NEW API arslan-apis-v2",
    category: "download",
    react: "📘",
    use: ".fb <facebook url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("❌ Facebook video link do\n\nExample:\n.fb https://facebook.com/xxxx");
        }

        if (!q.includes("facebook.com") && !q.includes("fb.watch")) {
            return reply("❌ Valid Facebook URL nahi hai");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // ✅ NEW WORKING API
        const api = `https://arslan-apis-v2.vercel.app/download/fbdown?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api, { timeout: 60000 });

        if (
            !data?.status ||
            !data?.result?.download ||
            (!data.result.download.hd && !data.result.download.sd)
        ) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ Facebook video fetch nahi ho saka");
        }

        const meta = data.result.metadata || {};
        const dl = data.result.download;

        const videoUrl = dl.hd || dl.sd;
        const quality = dl.hd ? "HD" : "SD";

        // ✅ UPDATED BRANDING - 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈
        const caption =
`*╭┉┉┉┉◉◉◉┉┉┉┉┉┉┉┉┉━┈⍟*
*┋* *_ғᴀᴄᴇʙᴏᴏᴋ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ_*
*┋┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉━•⟢*
*┋➠ 🎬 ᴛɪᴛʟᴇ:* ${meta.title || 'N/A'}
*┋➠ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ:* ${meta.duration || 'N/A'}
*┋➠ 📊 ᴀᴠᴀɪʟᴀʙʟᴇ:* HD${dl.hd ? ' ✅' : ' ❌'} | SD${dl.sd ? ' ✅' : ' ❌'}
*┋➠ 📹 ǫᴜᴀʟɪᴛʏ:* ${quality}
*┋➠ ✅ sᴛᴀᴛᴜs:* ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ
*┋➠ 🤖 ʙᴏᴛ:* 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 💗💗
*╰┉┉┉┉◉◉◉┉┉┉┉┉┉┉┉┉━┈⍟*`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption,
            contextInfo: {
                externalAdReply: {
                    title: meta.title || "Facebook Video",
                    body: "Facebook Downloader - 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 💗",
                    thumbnailUrl: meta.thumbnail,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("FB-DL ERROR:", err.message);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("❌ Error aagaya, thori dair baad try karo");
    }
});
