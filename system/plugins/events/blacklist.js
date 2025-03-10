// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

async function events(m, {
    sock
}) {
    if (!m.isGroup) return;
    if (db.list().group[m.cht]?.blacklist?.includes(m.sender)) {
        return sock.sendMessage(m.cht, {
            delete: m.key
        });
    }
}
module.exports = {
    events,
}