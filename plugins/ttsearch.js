const axios = require('axios');
const { cmd } = require('../command');

async function searchTikTok(query) {
    const apis = [
        // API 1: Fetcher.sh (paid, reliable)
        async () => {
            const res = await axios.get(`https://tiktok.fetcher.sh/api/post/search?keyword=${encodeURIComponent(query)}`, {
                timeout: 15000,
                headers: { 'Authorization': 'Bearer YOUR_FETCHER_KEY' }
            });
            if (res.data?.data?.posts?.length) {
                const v = res.data.data.posts[0];
                return {
                    video: v.video_url || v.play_url || v.download_url,
                    title: v.caption || query,
                    author: v.author?.nickname || v.author?.handle || 'TikTok Creator'
                };
            }
            return null;
        },

        // API 2: Omkar Cloud (free 100 queries/month)
        async () => {
            const res = await axios.get(`https://tiktok-scraper.omkar.cloud/tiktok/videos/search`, {
                params: { search_query: query, max_results: 5 },
                timeout: 15000,
                headers: { 'API-Key': 'YOUR_OMKAR_KEY' }
            });
            if (res.data?.videos?.length) {
                const v = res.data.videos[0];
                return {
                    video: v.media?.video_url || v.media?.hd_video_url,
                    title: v.caption || query,
                    author: v.author?.display_name || v.author?.handle || 'TikTok Creator'
                };
            }
            return null;
        },

        // API 3: shadowx-tiksr (NPM package, free)
        async () => {
            const TikSR = require('shadowx-tiksr');
            const tiktok = new TikSR();
            const result = await tiktok.download(query);
            if (result?.download?.video_url) {
                return {
                    video: result.download.video_url,
                    title: result.video?.title || query,
                    author: result.video?.author?.nickname || 'TikTok Creator'
                };
            }
            return null;
        },

        // API 4: TikWM (updated endpoint)
        async () => {
            const res = await axios.post('https://www.tikwm.com/api/feed/search', {
                keywords: query,
                count: 5,
                cursor: 0,
                web: 1,
                hd: 1
            }, {
                timeout: 15000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.tikwm.com/'
                }
            });
            if (res.data?.data?.videos?.length) {
                const v = res.data.data.videos[0];
                return {
                    video: v.play,
                    title: v.title || query,
                    author: v.author?.nickname || v.author?.unique_id || 'TikTok Creator'
                };
            }
            return null;
        },

        // API 5: untiktok-api (NPM, Playwright based)
        async () => {
            const { TikTokClient } = require('@traceryn/tiktok-sdk');
            const client = new TikTokClient();
            const result = await client.searchVideos(query);
            if (result?.videos?.length) {
                const v = result.videos[0];
                return {
                    video: v.playUrl || v.downloadUrl,
                    title: v.title || query,
                    author: v.author?.nickname || 'TikTok Creator'
                };
            }
            return null;
        },

        // API 6: Scavio (NPM, real-time search)
        async () => {
            const { Composio } = require('@composio/core');
            const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
            // Use Scavio toolkit for TikTok search
            const res = await axios.get(`https://api.scavio.dev/v1/tiktok/search`, {
                params: { q: query },
                timeout: 15000,
                headers: { 'Authorization': `Bearer YOUR_SCAVIO_KEY` }
            });
            if (res.data?.results?.length) {
                const v = res.data.results[0];
                return {
                    video: v.video_url || v.download_url,
                    title: v.title || query,
                    author: v.author || 'TikTok Creator'
                };
            }
            return null;
        }
    ];

    // Har API try karo, jo pehle kaam kare woh result de do
    for (const apiFn of apis) {
        try {
            const result = await apiFn();
            if (result && result.video) {
                return result;
            }
        } catch (e) {
            continue;
        }
    }

    return null;
}

cmd({
    pattern: "ttsearch",
    alias: ["tiktoksearch", "tiktoks", "tts"],
    desc: "TikTok search - 6 working APIs (2026)",
    category: "search",
    react: "🎵",
    use: ".ttsearch <query>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Query likho\n\nExample:\n.ttsearch funny\n.ttsearch cat videos");

        await conn.sendMessage(from, { text: `🔍 Searching TikTok for: "${q}"...` }, { quoted: mek });

        const result = await searchTikTok(q.trim());

        if (!result || !result.video) {
            return reply(`❌ Video nahi mili: *${q}*\n\nTry:\n.ttsearch funny cat\n.ttsearch dance`);
        }

        const caption = `═══════════════════\n   🎬 TIKTOK SEARCH RESULT\n═══════════════════\n\n👤 Query: ${q}\n🎥 Title: ${result.title?.slice(0, 120) || q}\n✍️ Creator: ${result.author}\n\n⚡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭 💖`;

        await conn.sendMessage(from, {
            video: { url: result.video },
            mimetype: "video/mp4",
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log("TTSEARCH FINAL:", e.message);
        reply("❌ Server busy, 10 sec baad try karo");
    }
});
