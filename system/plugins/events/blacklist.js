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