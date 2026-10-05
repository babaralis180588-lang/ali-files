const axios = require('axios');
const { cmd } = require('../command');

// 请替换为你自己的 API Key（如果该接口需要）
const API_KEY = 'YOUR_API_KEY';

cmd({
    pattern: "movieinfo",
    desc: "Search for a movie and return its play link.",
    category: "utility",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        // 1. 提取电影名称
        const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();
        
        if (!movieName) {
            return reply("📽️ Please provide the name of the movie.\nExample: .movieinfo Spider Man");
        }

        // 2. 搜索电影
        const searchUrl = `https://yingshi.yaohud.cn/api.php/provide/vod/?ac=detail&wd=${encodeURIComponent(movieName)}&key=${API_KEY}`;
        const searchRes = await axios.get(searchUrl);

        // 检查搜索结果
        if (!searchRes.data || !searchRes.data.list || searchRes.data.list.length === 0) {
            return reply("🚫 Movie not found. Please check the name and try again.");
        }

        // 获取第一个匹配的电影信息
        const movie = searchRes.data.list[0];
        
        // 3. 获取播放详情（如果API直接返回了播放链接，则无需二次请求）
        let playUrl = null;
        let sourceName = 'Unknown';

        if (movie.vod_play_url) {
            // 解析播放链接（通常格式为 "第01集$http://xxx.m3u8#第02集$..."）
            const playString = movie.vod_play_url.split('$$$')[0];
            const firstPlay = playString.split('#')[0];
            if (firstPlay && firstPlay.includes('$')) {
                playUrl = firstPlay.split('$')[1];
            }
        } else if (movie.vod_id) {
            // 如果没有直接返回播放链接，则根据 ID 调用详情接口（需要确保接口支持该参数）
            const detailUrl = `https://yingshi.yaohud.cn/api.php/provide/vod/?ac=detail&ids=${movie.vod_id}&key=${API_KEY}`;
            const detailRes = await axios.get(detailUrl);
            if (detailRes.data && detailRes.data.list && detailRes.data.list.length > 0) {
                const detail = detailRes.data.list[0];
                if (detail.vod_play_url) {
                    const playString = detail.vod_play_url.split('$$$')[0];
                    const firstPlay = playString.split('#')[0];
                    if (firstPlay && firstPlay.includes('$')) {
                        playUrl = firstPlay.split('$')[1];
                    }
                }
            }
        }

        // 如果解析到的还是播放页面地址而非直接的 m3u8 文件，可尝试使用解析接口（根据截图需求实现）
        if (playUrl) {
            // 提取真实的 m3u8 地址（如果 API 返回的已经是解析后的链接，则无需此步）
            // 此处保留原始链接，若需解析可调用三方解析接口
            const parsedUrl = playUrl;
            
            // 4. 构建消息并发送
            const caption = `
🎬 *${movie.vod_name}* (${movie.vod_year}) 
⭐ *评分:* ${movie.vod_douban_score || 'N/A'}

📝 *简介:* ${movie.vod_blurb || movie.vod_content || '暂无简介'}

🌐 *来源:* ${movie.vod_remarks || 'Unknown'}
🔗 *播放链接:* ${parsedUrl}

[点击观看](${parsedUrl})
`;

            await conn.sendMessage(
                from,
                {
                    image: { url: movie.vod_pic || 'https://files.catbox.moe/7zfdcq.jpg' },
                    caption: caption,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363413386172269@newsletter',
                            newsletterName: 'Ali Md mini',
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );
        } else {
            return reply("🚫 Found the movie, but couldn't retrieve a play link.");
        }

    } catch (e) {
        console.error('Movie command error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});
