// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
    command: "hidetag",
    alias: ["ht", "hidetag"],
    category: ["group"],
    settings: {
        group: true,
        admin: true,
        botAdmin: true
    },
    description: "📢 Memberitahukan semua member group",
    loading: false,
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        if (!text) {
            throw '> Masukan pesan yang ingin anda sampaikan ke member'
        }
        sock.sendMessage(
            m.cht, {
                text: text,
                mentions: m.metadata.participants.map((a) => a.id)
            }, {
                quoted: m
            },
        );
    },
};