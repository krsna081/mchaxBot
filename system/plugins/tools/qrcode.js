// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

module.exports = {
    command: "qrcode",
    alias: [],
    category: ["tools"],
    description: "Download dan upload QR code",
    async run(m, {
        sock,
        Func,
        isPrems,
        Uploader,
        config,
        text
    }) {
        let q = m.quoted ? m.quoted : m; 
        if (!text && !q.isMedia)
            throw `╭──[❌ *Cara Penggunaan*]\n᎒⊸ *\`--upload\`* Untuk upload video ke server menjadi QR code\n᎒⊸ *\`(reply)\`* Untuk download data dari QR code\n╰────────────•`;

        if (text.includes("--upload")) {
            let cleanText = text.replace("--upload", "").trim(); // Hapus --upload dari teks
            if (!cleanText) return m.reply("Masukkan pesan untuk dijadikan QR code!");

            let {
                data
            } = await axios.get(`https://fastrestapis.fasturl.cloud/tool/qr/generator?data=${encodeURIComponent(cleanText)}&type=text&background=rgb(255,255,255)`, {
                responseType: 'arraybuffer'
            });

            sock.sendMessage(m.cht, {
                image: data,
                caption: "Berhasil membuat QR Code!"
            }, {
                quoted: m
            });
        } else {
            if (!q.msg.mimetype || !/image/.test(q.msg.mimetype) || !q.isMedia)
                throw `> Reply/kirim gambar dengan caption *${m.prefix + m.command}*`;

            let buffer = await q.download();
            let imageUrl = await Uploader.catbox(buffer);

            let {
                data
            } = await axios.get(`https://fastrestapis.fasturl.cloud/tool/qr/scanner?url=${imageUrl}`);
            if (!data.result || !data.result.codeData)
                throw "QR code tidak dapat dipindai atau tidak valid.";

            m.reply(`🔍 Hasil Scan QR Code:\n\n${data.result.codeData}`);
        }
    }
};