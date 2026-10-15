module.exports = {
  name: 'gstatus',
  aliases: ['groupstatus', 'allgroupstatus', 'status'],
  category: 'group',
  description: 'Status ko sab groups me lagao',

  async execute(sock, msg, args, extra) {
    try {
      // Reply wala message nikalo
      let quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      let quotedImg = quoted?.imageMessage;
      let quotedVid = quoted?.videoMessage;
      let quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text;

      // Agar reply nahi kiya to
      if (!quoted) {
        return extra.reply(
          "*طریقہ استعمال:*\n\n1. کسی بھی Status / تصویر / ویڈیو پر Reply کرو\n2. اور لکھو .gstatus\n\nتو وہ چیز آپ کے سارے گروپس میں چلی جائے گی"
        );
      }

      await extra.react('⏳');
      await extra.reply("⏳ سارے گروپس نکال رہا ہوں...");

      // Sare groups nikalo
      let groups = await sock.groupFetchAllParticipating();
      let groupIds = Object.keys(groups);

      if (groupIds.length === 0) return extra.reply("❌ کوئی گروپ نہیں ملا");

      await extra.reply(`✅ ${groupIds.length} گروپس مل گئے، اب اسٹیٹس لگ رہا ہے...`);

      let count = 0;

      for (let id of groupIds) {
        try {
          if (quotedImg) {
            let buffer = await extra.downloadMedia(quoted);
            await sock.sendMessage(id, { image: buffer, caption: quotedImg.caption || "" });
          } else if (quotedVid) {
            let buffer = await extra.downloadMedia(quoted);
            await sock.sendMessage(id, { video: buffer, caption: quotedVid.caption || "", mimetype: 'video/mp4' });
          } else if (quotedText) {
            await sock.sendMessage(id, { text: quotedText });
          }
          count++;
          await new Promise(r => setTimeout(r, 1000)); // 1 sec delay taake ban na lage
        } catch (e) {}
      }

      await extra.react('✅');
      return extra.reply(`✅ ہو گیا! آپ کا اسٹیٹس ${count} گروپس میں لگ گیا`);

    } catch (e) {
      extra.reply("❌ ایرر: " + e.message);
    }
  }
};
