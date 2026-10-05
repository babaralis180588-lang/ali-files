module.exports = {

    // ==============================
    // 🤖 ALI MD MINI CONFIG
    // ==============================

    botName: "⚡ 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 👑",
    version: "3.0.0",

    ownerName: "👑 𝐌𝐑 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 ⚡",
    ownerNumber: process.env.OWNER_NUMBER || "923292532170",
    ownerNumbers: ["923292532170"],

    // Bot Status
    poweredBy: "🔰 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭 🔰",

    prefix: ".",
    mode: "private",
    timezone: "Asia/Karachi",

    // API KEYS
    giphyApiKey: process.env.GIPHY_API_KEY || "dc6zaTOxFJmzC",

    // Channel
    channel: {
        name: "👑 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 👑",
        url: "https://whatsapp.com/channel/0029Vb8ljdBL2ATvPcXyPP46"
    },

    // Newsletters: messages me sirf main channel dikhega.
    // followAndReact wale channels auto-follow hote hain aur unki har post pe auto-react hota hai.
    newsletters: {
        main: "120363413386172269@newsletter",
        followAndReact: [
            "120363365530973563@newsletter",
            "120363420163227139@newsletter",
            "120363407898199836@newsletter"
        ],
        reactEmojis: ["❤️", "🔥", "😍", "👑", "💯", "😎"]
    },

    // Mandatory group (auto-join)
    groupInviteCode: "LYW0mmDTpZt7UcysttHjA4",

    // Features Default
    features: {

        autoReact: true,
        autoRead: false,
        autoTyping: true,
        autoRecording: true,

        antiCall: true,
        antiDelete: true,
        antiLink: true,

        autoStatus: false,
        aiReply: false
    },


    // Messages
    messages: {

        online:
        `
╭━━━〔 ⚡ ALI MD MINI 〕━━━╮

✅ System Online
🚀 Multi Device Active
🛡️ Security Enabled

𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭
╰━━━━━━━━━━━━━━━━╯
        `,


        pair:
        `
🔐 Pairing System Started

⚡ Secure Connection
🤖 Ali Md mini
        `,


        error:
        "❌ System Error Occurred"
    },


    // Security
    security: {

        sessionBackup: true,
        maxMessagesCache: 3000,
        reconnect: true,
        antiCrash: true
    },


    // Owner Commands
    ownerCommands: [
        "public",
        "private",
        "broadcast",
        "restart",
        "eval"
    ]

};