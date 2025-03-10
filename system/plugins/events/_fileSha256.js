// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

async function events(m, {
    sock,
    chatUpdate
}) {
    if (!m.message) return;
    if (!m.msg.fileSha256) return;
    const stickerHash = await m.msg.fileSha256.toString("base64");
    if (!(stickerHash in db.list().sticker)) return;
    const {
        message
    } = db.list().sticker[stickerHash];
    sock.appendTextMessage(m, message, chatUpdate);
};

module.exports = {
    events,
};