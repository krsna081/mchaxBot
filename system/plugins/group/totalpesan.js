module.exports = {
    command: "totalpesan",
    alias: ["totalchat"],
    category: ["group"],
    settings: {
        group: true,
        admin: true
    },
    description: "Melihat total pesan anggota grup hari ini",
    async run(m, {
        sock,
        store,
        config
    }) {
        if (!db.list().group[m.cht]) return sock.reply(m.chat, "⚠️ Data belum tersedia untuk grup ini.", m);

        let totalPesan = db.list().group[m.cht].totalpesan || {};
        let chat = Object.entries(totalPesan)
            .filter(([_, data]) => data.chat > 1) // Hanya ambil yang chatnya > 1
            .sort((a, b) => b[1].chat - a[1].chat); // Urutkan dari yang terbesar

        let teks = `📊 *Total Pesan Hari Ini*:\n\n`;

        if (chat.length === 0) {
            teks += `Tidak ada anggota dengan jumlah pesan lebih dari 1.`;
        } else {
            teks += chat.map(([user, data], i) =>
                `${i + 1}. @${user.split`@`[0]}\n     Chat : ${formatNumber(data.chat)}`
            ).join("\n");
        }

        sock.sendMessage(m.cht, {
            text: teks,
            footer: config.name,
            contextInfo: {
                mentionedJid: chat.map(([user]) => user),
                forwardingScore: 256,
                isForwarded: true,
                externalAdReply: {
                    title: "Statistik Grup",
                    body: null,
                    sourceUrl: "",
                    thumbnailUrl: "https://i.pinimg.com/originals/d0/c6/2f/d0c62fb8a8bdb1428db0e330bc57edb7.png"
                }
            }
        }, {
            quoted: m
        });
    },
};

// Format angka ribuan
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}