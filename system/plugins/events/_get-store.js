async function events(m, {
    sock,
    isPrems
}) {
    if (!m.isGroup) return;
    if (db.list().group[m.cht]?.mute) return;
    if (m.isBot && m.fromMe) return;
    if (m.type === 'reactionMessage') return;

    let msgs = db.list().group[m.cht]?.store;
    if (!msgs || !m.body) return;

    if (!msgs.hasOwnProperty(m.body)) return;

    if (/\d{5,16}@s\.whatsapp\.net$/.test(m.body)) return;

    let storedMsg = msgs[m.body];

    let _m = await sock.serializeM({
        key: storedMsg.key,
        message: storedMsg.message,
        sender: storedMsg.participant
    });

    await sock.sendMessage(m.cht, {
        forward: _m
    }, {
        quoted: m
    });
}

module.exports = {
    events,
};