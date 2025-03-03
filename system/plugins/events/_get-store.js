async function events(m, { sock, isPrems }) {
    if (!m.isGroup) return;
    if (m.isBot && m.fromMe) return;
    if (m.type === 'reactionMessage') return;
    if (!isPrems) return;

    let msgs = db.list().group[m.cht].store;
    let lowerCaseText = m.body?.toLowerCase();
    if (!lowerCaseText) return;

    let foundKey = Object.keys(msgs).find(key => lowerCaseText.startsWith(key.toLowerCase()));
    if (!foundKey) return;
    if (/\d{5,16}@s\.whatsapp\.net$/.test(foundKey)) return;

    let storedMsg = msgs[foundKey];

    let _m = await sock.serializeM({
        key: storedMsg.key,
        message: storedMsg.message,
        sender: storedMsg.participant
    });

    await sock.sendMessage(m.cht, { forward: _m }, { quoted: m });
}

module.exports = {
    events,
};