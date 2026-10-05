const settings = require('../settings');

function isOwner(senderId) {
    const list = (settings.ownerNumbers || [settings.ownerNumber]).map(n => n + '@s.whatsapp.net');
    return list.includes(senderId);
}

module.exports = isOwner;
