const config = require('../config');

const DEBUG = true;

function log(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

function errorLog(...args) {
    if (DEBUG) {
        console.error(...args);
    }
}

async function getGroupMetadataSafe(conn, groupId) {
    try {
        if (!conn || !groupId) return null;
        if (!groupId.endsWith("@g.us")) return null;
        const metadata = await conn.groupMetadata(groupId);
        return metadata;
    } catch (err) {
        errorLog("Error in getGroupMetadataSafe:", err.message);
        return null;
    }
}

const containsHttpLink = (text) => {
    if (!text || typeof text !== 'string') return false;
    const patterns = [ 
        /(https?:\/\/)?(www\.)?chat\.whatsapp\.com\/[a-zA-Z0-9]+/gi,
        /(https?:\/\/)?(www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9/]+/gi
    ];
    return patterns.some(pattern => pattern.test(text));
};

let warnDB = {};

setInterval(() => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    for (const group in warnDB) {
        for (const user in warnDB[group]) {
            if (warnDB[group][user].timestamp < oneDayAgo) {
                delete warnDB[group][user];
            }
        }
        if (Object.keys(warnDB[group]).length === 0) {
            delete warnDB[group];
        }
    }
}, 60 * 60 * 1000);

module.exports = async function AntiLink(conn, mek, userConfig) {
    try {
        if (!conn || !conn.user || !mek || !mek.message || !mek.key) return;

        const from = mek.key.remoteJid;
        if (!from || !from.endsWith("@g.us")) return;

        if (userConfig.ANTI_LINK !== "true") return;

        const body = (() => {
            try {
                if (mek.message?.conversation) return mek.message.conversation;
                if (mek.message?.extendedTextMessage?.text) return mek.message.extendedTextMessage.text;
                if (mek.message?.imageMessage?.caption) return mek.message.imageMessage.caption;
                if (mek.message?.videoMessage?.caption) return mek.message.videoMessage.caption;
                if (mek.message?.documentMessage?.caption) return mek.message.documentMessage.caption;
                const msgType = Object.keys(mek.message)[0];
                if (msgType && mek.message[msgType]?.text) return mek.message[msgType].text;
                if (msgType && mek.message[msgType]?.caption) return mek.message[msgType].caption;
            } catch (e) { return ""; }
            return "";
        })();

        if (!containsHttpLink(body)) return;

        const groupMetadata = await getGroupMetadataSafe(conn, from);
        if (!groupMetadata) return;

        const sender = mek.key.participant || mek.key.participantAlt || "";
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        const senderPN = sender.split("@")[0];

        const groupAdmins = groupMetadata.participants
            .filter(p => p.admin === "admin" || p.admin === "superadmin")
            .map(p => p.id.split("@")[0]);

        const botPN = botNumber.split("@")[0];
        if (!groupAdmins.includes(botPN)) return;

        if (groupAdmins.includes(senderPN)) return;

        const action = (userConfig.ANTI_LINK_ACTION || "delete").toLowerCase();

        const deleteMessage = async () => {
            try {
                await conn.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: mek.key.id, participant: sender } });
            } catch (err) { errorLog("❌ Delete failed:", err); }
        };

        const sendNotification = async (text) => {
            try {
                await conn.sendMessage(from, { text: text, mentions: [sender] });
            } catch (err) { errorLog("❌ Notification send failed:", err); }
        };

        switch(action) {
            case "kick":
                await deleteMessage();
                try {
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    await sendNotification(`🚫 @${senderPN} Links are not allowed! User removed.`);
                } catch (err) { await sendNotification(`❌ Failed to remove @${senderPN}.`); }
                break;
            case "warn":
                if (!warnDB[from]) warnDB[from] = {};
                if (!warnDB[from][sender]) warnDB[from][sender] = { count: 0, timestamp: Date.now() };
                warnDB[from][sender].count += 1;
                warnDB[from][sender].timestamp = Date.now();
                const warns = warnDB[from][sender].count;
                await deleteMessage();
                if (warns < 3) {
                    await sendNotification(`⚠️ @${senderPN} Links are not allowed! Warning ${warns}/3`);
                } else {
                    try {
                        await conn.groupParticipantsUpdate(from, [sender], "remove");
                        await sendNotification(`🚫 @${senderPN} Max warnings reached. User removed.`);
                        warnDB[from][sender].count = 0;
                    } catch (err) { await sendNotification(`❌ Failed to remove @${senderPN}.`); }
                }
                break;
            default:
                await deleteMessage();
                await sendNotification(`⚠️ @${senderPN} Links are not allowed in this group!`);
        }
    } catch (err) {
        errorLog("❌ AntiLink System Error:", err);
    }
};