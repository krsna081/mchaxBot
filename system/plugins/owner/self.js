// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
    command: "self",
    alias: [],
    category: ["owner"],
    settings: {
        owner: true,
    },
    description: "🔇 Ubah bot menjadi mode senyap (Self Mode)",
    async run(m, {
        sock,
        text
    }) {
        if (!text)
            return m.reply(`*– 乂 *Cara Penggunaan Fitur Mode Senyap (Self Mode)*\n\n> *\`0\`* - Untuk mematikan fitur self mode (Bot aktif di grup)\n> *\`1\`* - Untuk menghidupkan fitur self mode (Bot hanya aktif di private chat)`);

        let settings = db.list().settings;
        settings.self = parseInt(text) > 0 ? true : false;

        m.reply(
            `> ✅ Fitur *Self Mode* berhasil ${text < 1 ? "dimatikan" : "diaktifkan"}. Bot akan ${text < 1 ? "kembali bergabung ke grup" : "hanya dapat digunakan melalui pesan pribadi"}.`,
        );
    },
};