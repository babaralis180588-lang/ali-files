// lib/pluginBridge.js
// Plugin-style plugin engine for Ali Md mini bot.
// Loads every file in ./plugins (cmd({pattern,...}, fn) format) and runs a
// matching plugin BEFORE the older built-in commands. Plugins get the same
// (conn, mek, m, ctx) arguments they were written for, and replies go out
// through the raw socket so the original message style stays exactly the same.

const fs = require('fs');
const path = require('path');
const { getContentType, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys');
const config = require('../config');
const { commands } = require('../command');
const { getGroupAdmins } = require('./functions');

const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const CFG_FILE = path.join(__dirname, '..', 'data', 'plugin_userconfig.json');

let loaded = false;
let store = null;

// Make sure every command name (pattern or alias) belongs to exactly ONE command.
// Rule: a command whose *pattern* is the name wins over one that only has it as an alias;
// between equals the first loaded wins. Losers lose that name (so menus never list a command twice).
function dedupeCommands(log) {
    const owner = new Map();               // name -> command
    const list = commands.filter(c => c.pattern || (c.alias && c.alias.length));
    for (const c of list) {                // pass 1: patterns
        if (typeof c.pattern === 'string' && c.pattern.trim()) {
            const n = c.pattern.trim().toLowerCase();
            if (!owner.has(n)) owner.set(n, c);
        }
    }
    for (const c of list) {                // pass 2: aliases (only names nobody owns yet)
        for (const a of (Array.isArray(c.alias) ? c.alias : [])) {
            const n = String(a).trim().toLowerCase();
            if (n && !owner.has(n)) owner.set(n, c);
        }
    }
    let removed = 0;
    for (const c of list) {
        if (Array.isArray(c.alias)) {
            const keep = [];
            for (const a of c.alias) {
                const n = String(a).trim().toLowerCase();
                if (owner.get(n) === c && n !== String(c.pattern || '').toLowerCase() && !keep.includes(a)) keep.push(a);
                else removed++;
            }
            c.alias = keep;
        }
        if (typeof c.pattern === 'string' && c.pattern.trim()) {
            const n = c.pattern.trim().toLowerCase();
            if (owner.get(n) !== c) {
                removed++;
                c.pattern = c.alias && c.alias.length ? c.alias.shift() : '';   // promote an alias, else hide it
            }
        }
    }
    lookup = new Map();
    for (const c of commands) {
        if (c.pattern instanceof RegExp) continue;
        if (typeof c.pattern === 'string' && c.pattern.trim()) lookup.set(c.pattern.trim().toLowerCase(), c);
    }
    for (const c of commands) {
        for (const a of (Array.isArray(c.alias) ? c.alias : [])) {
            const n = String(a).trim().toLowerCase();
            if (n && !lookup.has(n)) lookup.set(n, c);
        }
    }
    if (removed) log(`[plugins] removed ${removed} duplicate command names`);
}

let lookup = new Map();

function loadPlugins(log = console.log) {
    if (loaded) return commands.length;
    loaded = true;
    if (!fs.existsSync(PLUGINS_DIR)) return 0;
    let ok = 0, bad = 0;
    for (const file of fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js')).sort()) {
        try { require(path.join(PLUGINS_DIR, file)); ok++; }
        catch (e) { bad++; log(`[plugins] ${file} load failed: ${e.message}`); }
    }
    dedupeCommands(log);
    log(`[plugins] loaded ${ok} files (${bad} failed), ${commands.length} commands/listeners registered`);
    return commands.length;
}

function readStore() {
    if (store) return store;
    try { store = JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')); } catch (e) { store = {}; }
    return store;
}
function saveStore() {
    try {
        fs.mkdirSync(path.dirname(CFG_FILE), { recursive: true });
        fs.writeFileSync(CFG_FILE, JSON.stringify(store, null, 2));
    } catch (e) {}
}
function getUserConfig(num) {
    const s = readStore();
    const cfg = Object.assign({}, JSON.parse(JSON.stringify(config.DEFAULT_SETTINGS)), s[num] || {});
    return cfg;
}

// Proxy so plugins use the raw sendMessage (no extra boxes/channel tags added by the older wrappers)
function rawSock(sock) {
    if (!sock.__rawSendMessage) return sock;
    return new Proxy(sock, {
        get(t, p, r) { return p === 'sendMessage' ? t.__rawSendMessage : Reflect.get(t, p, t); },
        set(t, p, v) { t[p] = v; return true; }
    });
}

function findCommand(name) {
    if (!name) return null;
    const hit = lookup.get(String(name).toLowerCase());
    if (hit) return hit;
    return commands.find(c => c.pattern instanceof RegExp && c.pattern.test(name)) || null;
}

function hasCommand(name) { loadPlugins(); return !!(name && findCommand(name)); }

async function buildContext({ sock, msg, from, sender, text, commandName, args, isOwner, prefix, light }) {
    const conn = rawSock(sock);
    const isGroup = from.endsWith('@g.us');
    const botNumber2 = sock.user?.id ? sock.user.id.split(':')[0] : '';
    const botJid = botNumber2 ? botNumber2 + '@s.whatsapp.net' : '';
    const fromMe = !!msg.key?.fromMe;
    const senderNumber = String(sender).split('@')[0];
    const userConfig = getUserConfig(botNumber2);

    conn.decodeJid = j => {
        if (!j) return j;
        if (/:\d+@/gi.test(j)) { const d = jidDecode(j) || {}; return (d.user && d.server && d.user + '@' + d.server) || j; }
        return j;
    };
    conn.downloadMediaMessage = async (message) => {
        const type = message.mtype;
        const media = message.message[type];
        const stream = await downloadContentFromMessage(media, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        return buffer;
    };

    let groupMetadata = null, groupName = '', groupAdmins = [], isBotAdmins = false, isAdmins = false;
    if (isGroup && !light) {
        try {
            groupMetadata = await sock.groupMetadata(from);
            groupName = groupMetadata?.subject || '';
            groupAdmins = getGroupAdmins(groupMetadata?.participants || []);
            isBotAdmins = groupAdmins.includes(botJid);
            isAdmins = groupAdmins.includes(sender);
        } catch (e) {}
    }

    const inner = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message || {};
    const mtype = getContentType(inner);
    const contextInfo = inner?.[mtype]?.contextInfo || {};
    const quotedMsg = contextInfo.quotedMessage || null;
    const quotedParticipant = contextInfo.participant || null;
    const quoted = quotedMsg ? {
        message: quotedMsg,
        key: { remoteJid: from, fromMe: false, id: contextInfo.stanzaId, participant: quotedParticipant },
        sender: quotedParticipant,
        mtype: getContentType(quotedMsg),
        download: () => conn.downloadMediaMessage({ message: quotedMsg, mtype: getContentType(quotedMsg) })
    } : null;
    const mentionedJid = contextInfo.mentionedJid || [];
    const target = mentionedJid?.[0] || quotedParticipant || null;
    const pushname = msg.pushName || 'Sin Nombre';

    const SUDO = [...(userConfig.SUDO || config.SUDO || [])];
    const isSudo = SUDO.includes(sender) || fromMe || !!isOwner;
    const react = (emoji) => conn.sendMessage(from, { react: { text: emoji, key: msg.key } });
    const reply = (t) => conn.sendMessage(from, { text: String(t) }, { quoted: msg });

    const m = {
        key: msg.key, message: msg.message, messageTimestamp: msg.messageTimestamp, pushName: msg.pushName,
        from, sender, senderNumber, fromMe, body: text, mtype, isGroup, quoted, mentionedJid, pushname, react, target, chat: from
    };
    const ctx = {
        from, body: text, isCmd: true, command: commandName, args, q: args.join(' '), text: args.join(' '), prefix,
        isGroup, sender, senderNumber, senderNum: senderNumber, sanitizedNumber: botNumber2, botNumber: botNumber2, botNumber2,
        pushname, isMe: fromMe, isOwner: isSudo, isCreator: isSudo || fromMe, isDev: isSudo,
        isAdmins, isBotAdmins, groupMetadata, groupName, participants: groupMetadata?.participants || [], groupAdmins,
        quoted, mentionedJid, l: conn, reply, react, userConfig, config, target,
        updateUserConfig: async (num, cfg) => {
            const s = readStore(); s[num || botNumber2] = cfg; saveStore();
            Object.assign(userConfig, cfg);
        }
    };
    return { conn, m, ctx };
}

// Returns true when a plugin command handled the message.
async function dispatch(opts) {
    loadPlugins();
    const matched = findCommand(opts.commandName);
    if (!matched) return false;
    const { conn, m, ctx } = await buildContext(opts);
    if (matched.react) { try { await conn.sendMessage(opts.from, { react: { text: matched.react, key: opts.msg.key } }); } catch (e) {} }
    try {
        await matched.function(conn, m, m, ctx);
    } catch (err) {
        console.error(`[plugins] command failed [${opts.commandName}]:`, err.message);
        try { await ctx.reply(`⚠️ Error: ${err.message}`); } catch (e) {}
    }
    return true;
}

// Body listeners (cmd({on:'body'}, fn)) — run for every message.
async function runBodyListeners(opts) {
    loadPlugins();
    const listeners = commands.filter(c => c.on === 'body' && typeof c.function === 'function');
    if (!listeners.length) return;
    const { conn, m, ctx } = await buildContext({ ...opts, commandName: '', args: [], light: true });
    ctx.isCmd = false;
    for (const l of listeners) {
        try { await l.function(conn, m, m, ctx); } catch (e) {}
    }
}

async function groupEvents(sock, update) {
    try {
        const num = sock.user?.id ? sock.user.id.split(':')[0] : '';
        sock.userConfig = getUserConfig(num);
        await require('./groupevents')(rawSock(sock), update);
    } catch (e) {}
}

module.exports = { groupEvents, loadPlugins, dispatch, hasCommand, runBodyListeners, getUserConfig };
