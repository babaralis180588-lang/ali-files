const { cmd, commands } = require("../command");
const axios = require("axios");
const crypto = require('crypto');
const https = require("https");

// DELETE OLD CONVERTERS
(() => {
    try {
        for (let i = commands.length - 1; i >= 0; i--) {
            const c = commands[i];
            if (!c) continue;
            const pat = (c.pattern || "").toString().toLowerCase();
            const alias = (c.alias || []).map(a => a.toLowerCase());
            if ((pat === "mp3" || pat === "audio" || alias.includes("mp3") || alias.includes("audio")) &&
                (c.category === "convert" || (c.desc && c.desc.toLowerCase().includes("reply")))) {
                commands.splice(i, 1);
            }
        }
    } catch {}
})();

// ========== YOUTUBE SEARCH ==========
async function searchYouTube(query) {
    const url = "https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW4";
    const postData = JSON.stringify({
        query: query,
        context: { client: { clientName: "WEB", clientVersion: "2.20240701.01.00" } }
    });
    const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } };
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject("JSON parse failed"); } });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function yts(options) {
    try {
        let query = typeof options === "string" ? options : options.videoId;
        const data = await searchYouTube(query);
        let videos = [];
        const sections = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || data.contents || [];
        sections.forEach(section => {
            const items = section.itemSectionRenderer?.contents || section.richItemRenderer?.content || [];
            items.forEach(item => {
                const video = item.videoRenderer || item.richItemRenderer?.content?.videoRenderer;
                if (video && video.videoId) videos.push(video);
            });
        });
        const formatted = videos.map(v => {
            const title = v.title?.runs?.[0]?.text || v.title?.simpleText || "No Title";
            const videoId = v.videoId;
            const viewsText = v.viewCountText?.simpleText || v.shortViewCountText?.simpleText || "0 views";
            const thumbnail = v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length -1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            const timestamp = v.lengthText?.simpleText || "0:00";
            const authorName = v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || "Unknown";
            return { title, videoId, url: `https://youtube.com/watch?v=${videoId}`, thumbnail, image: thumbnail, timestamp, views: viewsText, viewsText, author: { name: authorName } };
        });
        if (typeof options === "object" && options.videoId) return formatted[0] || { title: "YouTube Video", videoId: options.videoId, url: `https://youtube.com/watch?v=${options.videoId}`, thumbnail: `https://i.ytimg.com/vi/${options.videoId}/hqdefault.jpg`, image: `https://i.ytimg.com/vi/${options.videoId}/hqdefault.jpg`, timestamp: "Unknown", views: "Unknown", viewsText: "Unknown", author: { name: "Unknown" } };
        return { videos: formatted };
    } catch { 
        return typeof options === "object" ? { title: "YouTube Video", videoId: options.videoId, url: `https://youtube.com/watch?v=${options.videoId}`, thumbnail: `https://i.ytimg.com/vi/${options.videoId}/hqdefault.jpg`, image: `https://i.ytimg.com/vi/${options.videoId}/hqdefault.jpg`, timestamp: "Unknown", views: "Unknown", viewsText: "Unknown", author: { name: "Unknown" } } : { videos: [] }; 
    }
}

function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}
function normalizeYouTubeUrl(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/);
    return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

// ========== VIDEO API - BANDAHEALI YTMP4 - NEW WORKING ==========
const VIDEO_API = "https://bandaheali-apis.netlify.app/api/downloader/ytmp4";
const VIDEO_KEY = "bandaheali";

async function fetchVideoData(youtubeUrl) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const apiUrl = `${VIDEO_API}?url=${encodeURIComponent(youtubeUrl)}&key=${VIDEO_KEY}`;
            const res = await axios.get(apiUrl, { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } });
            const data = res.data;

            // YOUR GIVEN RESPONSE FORMAT
            // result: { title, video_id, duration, thumbnail, thumbnail_hq, qualities: {1080p,720p,480p,360p}, url, video_url, download_url, hd, sd, mp3... }

            if (data?.status === true && data?.result) {
                const r = data.result;
                const q = r.qualities || {};
                
                // Best Quality - 720p default (as per your old file)
                const finalUrl = q["720p"] || r["720p"] || r.video_url || r.url || r.download_url || r.download || r.hd || q["1080p"] || q["480p"] || q["360p"];
                
                if (!finalUrl) throw new Error("No video URL in response");

                let qualityLabel = "720p";
                if (q["720p"] || r["720p"]) qualityLabel = "720p";
                else if (q["1080p"] || r["1080p"]) qualityLabel = "1080p";
                else if (q["480p"]) qualityLabel = "480p";
                else if (q["360p"]) qualityLabel = "360p";

                return {
                    video_url: finalUrl,
                    title: r.title || "YouTube Video",
                    duration: r.duration || "Unknown",
                    thumbnail: r.thumbnail_hq || r.thumbnail,
                    quality: qualityLabel,
                    author: r.channel || r.author || "YouTube Artist",
                    usedApi: "𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 Official Apis",
                    all_qualities: q
                };
            }
            throw new Error("Invalid API response");
        } catch (e) {
            lastError = e;
            console.log(`[VIDEO API ytmp4] Attempt ${attempt} failed: ${e.message}`);
            if (attempt < 3) await new Promise(r => setTimeout(r, 1500 * attempt));
        }
    }
    throw lastError;
}

cmd({
    pattern: "video",
    alias: ["ytmp4", "vdl", "vid", "ytv"],
    react: "🎬",
    desc: "Download YouTube videos",
    category: "download",
    filename: __filename,
}, async (conn, mek, m, { from, q, reply, prefix, command }) => {
    try {
        if (!q) return reply(`🎬 *Video Downloader*\nUsage: ${prefix+command} <name or link>\nExample: ${prefix+command} Tum hi ho`);
        
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        const url = normalizeYouTubeUrl(q);
        let ytdata;
        if (url) {
            const videoId = getVideoId(q);
            ytdata = await yts({ videoId: videoId || q.split('v=')[1]?.split('&')[0] || q.split('/').pop() });
        } else {
            const search = await yts(q);
            if (!search.videos.length) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ No videos found.");
            }
            ytdata = search.videos[0];
        }

        // PEHLE INFO CARD - JO AAP KEH RAHE THE
        const infoCard = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎬 *𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓* 🎬 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ✦ *TITLE* ✦
┃ ${ytdata.title}
┃ ━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ✦ *CHANNEL* ${ytdata.author?.name || 'Unknown'}
┃ ✦ *DURATION* ${ytdata.timestamp || 'Unknown'}
┃ ✦ *VIEWS* ${ytdata.viewsText || ytdata.views || 'Unknown'}
┃ ✦ *STATUS* 🔄 Processing...
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

        await conn.sendMessage(from, { image: { url: ytdata.thumbnail }, caption: infoCard }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const dlData = await fetchVideoData(ytdata.url);

        if (!dlData?.video_url) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("❌ Failed to generate download link.");
        }

        // VIDEO WITH FINAL CAPTION - API NAME FIXED
        const successCard = `┌───────────────────┐
│ ✅ DOWNLOAD READY ✅ │
└───────────────────┘
┌───────────────────┐
│ 📺 "${dlData.title.length > 45 ? dlData.title.substring(0,45)+'...' : dlData.title}"
│
│ ✝️ Quality : ${dlData.quality}
│ ⏱️ Duration : ${dlData.duration}
│ 👤 Channel : ${dlData.author}
│ 🔌 Source : YouTube
│ 📦 Format : MP4
│ 🤖 API : ${dlData.usedApi}
└───────────────────┘
┌───────────────────┐
│ ⚡ Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓
└───────────────────┘`;

        await conn.sendMessage(from, { video: { url: dlData.video_url }, mimetype: "video/mp4", caption: successCard }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Video Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`❌ Error: ${e.message}`);
    }
});

// ========== SONG API - WORKING (UNCHANGED) ==========
const TIMEOUT = 20000;
const api = {
    get: (url, config = {}) => axios.get(url, { timeout: TIMEOUT, ...config }),
    post: (url, data, config = {}) => axios.post(url, data, { timeout: TIMEOUT, ...config })
};
const CDNS = ["cdn406.savetube.vip","cdn405.savetube.vip","cdn404.savetube.vip","cdn403.savetube.vip","cdn402.savetube.vip","cdn401.savetube.vip","cdn400.savetube.vip"];
const SECRET_KEY = Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12", "hex");
const ytHeaders = { "content-type": "application/json", "origin": "https://ytube.savetube.me", "referer": "https://ytube.savetube.me/", "user-agent": "Mozilla/5.0" };
function decryptData(enc) { const buf = Buffer.from(enc.replace(/\s/g, ""), "base64"); const iv = buf.subarray(0,16); const data = buf.subarray(16); const decipher = crypto.createDecipheriv("aes-128-cbc", SECRET_KEY, iv); return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString()); }
async function ytdlStream(url, type, quality) {
    const id = getVideoId(url); if (!id) throw new Error("Invalid YouTube URL");
    let lastError;
    for (const CDN of CDNS) {
        try {
            const infoRes = await api.post(`https://${CDN}/v2/info`, { url: `https://youtube.com/watch?v=${id}` }, { headers: ytHeaders });
            if (!infoRes.data?.status) throw new Error("Failed info");
            const info = decryptData(infoRes.data.data);
            const dlRes = await api.post(`https://${CDN}/download`, { id: info.id, key: info.key, downloadType: type, quality: String(quality) }, { headers: ytHeaders });
            const link = dlRes.data?.data?.downloadUrl; if (!link) throw new Error("No link");
            return { title: info.title, thumbnail: info.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, streamUrl: link };
        } catch (err) { lastError = err; }
    }
    throw lastError;
}
async function downloadSongLogic(conn, mek, m, from, args, reply) {
    try {
        if (!args[0]) return reply("❌ Song name ya YouTube link do!\n\nExample:\n.song Tum Hi Ho\n.mp3 Tum Hi Ho");
        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
        let query = args.join(" ");
        if (!query.includes("youtu")) {
            const search = await yts(query);
            if (!search.videos.length) return reply("❌ No results");
            query = search.videos[0].url;
        }
        const videoId = getVideoId(query); if (!videoId) return reply("❌ Invalid URL");
        const videoInfo = await yts({ videoId });
        await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail }, 
            caption: `🎵 *YOUTUBE MP3 DOWNLOADER*\n\n🎶 *Title:* ${videoInfo.title}\n👤 *Channel:* ${videoInfo.author?.name}\n⏱️ *Duration:* ${videoInfo.timestamp}\n\n⏳ Downloading audio...\n\n© Powered by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 𝐁𝐎𝐓`
        }, { quoted: mek });
        const data = await ytdlStream(query, "audio", "192");
        await conn.sendMessage(from, { audio: { url: data.streamUrl }, mimetype: "audio/mpeg", fileName: `${videoInfo.title}.mp3` }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
}
cmd({ pattern: "song", alias: ["play", "ytmp3"], desc: "Download YouTube audio", category: "download", react: "🎧", filename: __filename }, async (conn, mek, m, ctx) => { await downloadSongLogic(conn, mek, m, ctx.from, ctx.args, ctx.reply); });
cmd({ pattern: "mp3", alias: ["songmp3", "ytmp3dl"], desc: "Download YouTube audio - Fixed", category: "download", react: "🎧", filename: __filename }, async (conn, mek, m, ctx) => { await downloadSongLogic(conn, mek, m, ctx.from, ctx.args, ctx.reply); });
cmd({ pattern: "audio", alias: ["mp3audio", "ytaudio"], desc: "Download YouTube audio - Fixed", category: "download", react: "🎧", filename: __filename }, async (conn, mek, m, ctx) => { await downloadSongLogic(conn, mek, m, ctx.from, ctx.args, ctx.reply); });
