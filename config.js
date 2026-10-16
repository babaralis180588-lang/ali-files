// config.js - Ali Md mini bot
require('dotenv').config();

const config = {
    // MongoDB Configuration
    MONGODB_URL: process.env.MONGODB_URL || '',
    
    // Fixed Database Name
    DB_NAME: process.env.DB_NAME || 'ladlaking',
    
    // Collections Configuration
    COLLECTIONS: {
        SESSIONS: 'whatsapp_sessions',
        NUMBERS: 'active_numbers',
        CONFIGS: 'bot_configs'
    },
    
    // ✅ FIXED: Bot Configuration - Anti-Ban optimized
    AUTO_VIEW_STATUS: 'false', // Fixed: true se ban hota tha
    AUTO_STATUS_REACT: 'false',
    AUTO_STATUS_REPLY: 'false',
    STATUS_REPLY_MSG: '*_Your status viewed successfully by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 🤖_*',
    AUTO_RECORDING: 'false',
    AUTO_REACT: 'false',
    AUTO_TYPING: 'false',
    ALWAYS_ONLINE: 'false',
    VERSION: '4.0.0 Bᴇᴛᴀ',
    DESCRIPTION: '*© 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭*',
    ANTI_DELETE_PATH: 'inbox',
    ANTI_DELETE: 'false',
    ANTI_EDIT_PATH: 'inbox',
    ANTI_EDIT: 'false',
    STICKER_NAME: '𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈',
    ANTI_LINK: 'true',
    ANTI_LINK_ACTION: 'warn',
    WELCOME: 'false',
    GOODBYE: 'false',
    WELCOME_MESSAGE: '*_@user joined the group, welcome! 🎉_*',
    GOODBYE_MESSAGE: '*_@user has left the group, we will miss them! 👋_*',
    ADMIN_ACTION: 'false',
    MODE: 'public',
    PREFIX: '.',
    ANTI_CALL: 'false',
    REJECT_MSG: '*Call Rejected Automatically 📵*',
    READ_MESSAGE: 'false',
    AUTO_STATUS_SEEN: 'false', // Fixed: true se ban
    OWNER_REACT: 'true', // ✅ FIXED: false se react nahi aa raha tha
    CUSTOM_REACT: 'false',
    HEART_REACT: 'false',
    CUSTOM_EMOJIS: ['😊', '👍', '🚀', '💻', '🎉', '🔥'],
    HEART_EMOJIS: ['❤️', '💖', '💝', '💗', '💓', '💞', '💕', '💟', '♥️', '❤️‍🔥', '❤️‍🩹'],
    OWNER_EMOJIS: ['❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🩷', '🤎', '🖤', '🩶', '🤍', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    REACT_EMOJIS: [
'❤️','🔥','👏','😮','😢','👍','🎉','🙏','😍','😊','🥰','💕','🤩','✨','😎','🥳','🙌',
'💖','💗','💓','💞','💘','💝','💟','❣️','♥️','❤️‍🔥','❤️‍🩹',
'🧡','💛','💚','🩵','💙','💜','🩷','🤍','🤎','🖤','🩶',
'🌹','🌺','🌸','💐','🌷','🪷','🌻','🌼',
'⭐','🌟','💫','✨','⚡','☀️','🌈','☄️',
'👑','💎','🏆','🥇','🎖️','🏅',
'🎁','🎀','🧸','🍫','🍭','🍬',
'🦋','🕊️','🦢','🦚','🦜','🐬','🐳','🐠',
'🍓','🍒','🍑','🍍','🥭','🍉','🍇',
'🎵','🎶','🎤','🎧','🎸','🎹',
'🚀','🛸','🌍','🌎','🌏','🌙','⭐',
'💯','✔️','✅','☑️','💥','💫','🫶','🤝','💪',
'🏖️','🌊','⛱️','🏝️','🌅','🌄',
'🎇','🎆','🎊','🎈','🎂','🍰','🧁',
'💌','📩','📨','💍','💐','🪄',
'🔮','🪙','💠','🔷','🔹','🔸','🔶',
'🕯️','🪔','🏵️','🎗️','🌠','🌌',
'🫰','🤲','🙌','🙏','💐','💝',
'♾️','☘️','🍀','🌿','🌱','🌴','🎋',
'🧿','🪬','💎','👑','🏰','🗝️'
] ,
    
    // Bot Identity - ✅ FIXED: Same number everywhere
    BOT_NAME: '𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈',
    OWNER_NAME: '𝐌𝐑 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈',
    OWNER_NUMBER: '923292532170', // ✅ Main owner
    DEV: '923292532170',
    IK_IMAGE_PATH: './lib/love.jpg',
    BOT_IMAGE: 'https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg',
    
    // System Configuration
    MAX_RETRIES: 50,
    OTP_EXPIRY: 300000,
    BANNED: [],
    // ✅ FIXED: SUDO me main owner add, only owner can control settings
    SUDO: [ 
        "923292532170@s.whatsapp.net"
    ],
    
    // ✅ NEW: Owner Only Settings Control - Only owner can on/off commands
    OWNER_ONLY_SETTINGS: true, // Only owner can change settings
    SETTINGS_CONTROL: 'owner_only', // Only bot owner can on/off
    ALLOW_PUBLIC_SETTINGS: false, // Public users cannot on/off commands
    
    // Default Settings Template - ✅ FIXED
    DEFAULT_SETTINGS: { 
        // Status & View Settings - Anti-Ban
        AUTO_VIEW_STATUS: 'false',
        AUTO_STATUS_SEEN: 'false',
        AUTO_STATUS_REACT: 'false',
        AUTO_STATUS_REPLY: 'false',
        STATUS_REPLY_MSG: '*_Your status viewed successfully by 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈 🤖_*',
        READ_MESSAGE: 'false',
        
        // Auto Actions
        AUTO_RECORDING: 'false',
        AUTO_REACT: 'false',
        AUTO_TYPING: 'false',
        ALWAYS_ONLINE: 'false',
        OWNER_REACT: 'true', // ✅ Fixed react issue
        CUSTOM_REACT: 'false',
        HEART_REACT: 'false',
        CUSTOM_EMOJIS: ['😊', '👍', '🚀', '💻', '🎉', '🔥'],
        HEART_EMOJIS: ['❤️', '💖', '💝', '💗', '💓', '💞', '💕', '💟', '♥️', '❤️‍🔥', '❤️‍🩹'],
        
        // Anti Features
        ANTI_DELETE: 'false',
        ANTI_DELETE_PATH: 'inbox',
        ANTI_EDIT: 'false',
        ANTI_EDIT_PATH: 'inbox',
        ANTI_CALL: 'false',
        ANTI_LINK: 'true',
        ANTI_LINK_ACTION: 'warn',
        
        // Group Events
        WELCOME: 'false',
        GOODBYE: 'false',
        ADMIN_ACTION: 'false',
        
        // Message Templates
        WELCOME_MESSAGE: '*_@user joined the group, welcome! 🎉_*',
        GOODBYE_MESSAGE: '*_@user has left the group, we will miss them! 👋_*',
        REJECT_MSG: '*Call Rejected Automatically 📵*',
        
        // Bot Identity - ✅ FIXED: Same owner number
        VERSION: '4.0.0 Bᴇᴛᴀ',
        OWNER_NAME: '𝐌𝐑 𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈',
        OWNER_NUMBER: '923292532170', // ✅ Fixed from 923292532170 to 923292532170
        DEV: '923292532170',
        DESCRIPTION: '*© 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐀𝐥𝐢 𝐌𝐝 𝐦𝐢𝐧𝐢 𝐁𝐨𝐭*',
        STICKER_NAME: 'Ali Md mini',
        MODE: 'public',
        PREFIX: '.',
        BOT_NAME: '𝐀𝐋𝐈 𝐌𝐃 𝐌𝐈𝐍𝐈',
        BOT_IMAGE: 'https://i.ibb.co/gMN7ZqqY/7010565aaf6e.jpg',
        
        REACT_EMOJIS: ['😂', '❤️', '🔥', '👏', '😮', '😢', '🤣', '👍', '🎉', '🤔', '🙏', '😍', '😊', '🥰', '💕', '🤩', '✨', '😎', '🥳', '🙌'],
        OWNER_EMOJIS: ['❤️', '🔥', '👑', '⭐', '💎'],
        
        // Lists
        BANNED: [],
        // ✅ FIXED: Main owner in sudo
        SUDO: [ 
        "923292532170@s.whatsapp.net"
    ],
        
        // ✅ Owner only control
        OWNER_ONLY_SETTINGS: true,
        SETTINGS_CONTROL: 'owner_only',
        ALLOW_PUBLIC_SETTINGS: false
    }
};

module.exports = config;
