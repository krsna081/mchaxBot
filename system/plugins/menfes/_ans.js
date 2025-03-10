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
    sock.menfes = sock.menfes ?? {};
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    const session = Object.values(sock.menfes).find(v => v.state === 'CHATTING' && [v.a, v.b].includes(m.sender));
    if (session) {
        const target = session.a === m.sender ? session.b : session.a;
        if (mime) {
            sock.copyNForward(target, q, true, null);
        } else {
            await sock.sendMessage(target, {
                text: `📩 Pesan baru:\n\n${m.body}` + m.text
            })
        }
        m.reply("Pesan diteruskan.");
        return;
    }
}

module.exports = {
    events
}