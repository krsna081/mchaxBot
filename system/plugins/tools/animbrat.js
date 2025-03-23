// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    fromBuffer
} = require("file-type");
const axios = require("axios");
const {
    writeExif
} = require(process.cwd() + "/lib/sticker.js");

module.exports = {
    command: "animbrat",
    alias: ["animebrat"],
    category: ["tools"],
    settings: {
        limit: true
    },
    description: "🐾 Membuat anime versi furry :v",
    async run(m, {
        sock,
        text,
        config,
        Func
    }) {
        const isSticker = m.args.includes("--sticker");
        const isAnimated = m.args.includes("--animated");
        const prompt = text.replace(/--\w+(\=\w+)?/g, "").trim();

        if (!prompt) return m.reply(`⚠️ Masukkan teks!\nContoh: *.animbrat Halo Dunia --sticker*\n\n- *--sticker*: Hasilnya jadi stiker.\n- *--animated*: Buat stiker animasi.`);

        const apiUrl = `https://fastrestapis.fasturl.cloud/maker/animbrat?text=${encodeURIComponent(prompt)}&mode=${isAnimated ? "animated" : "image"}`;
        m.reply(`⏳ Mohon tunggu, ${isAnimated ? "stiker animasi" : "gambar"} sedang dibuat...`);

        try {
            const {
                data
            } = await axios.get(apiUrl, {
                responseType: "arraybuffer"
            });
            const metadata = await fromBuffer(data);
            if (isAnimated) {
                const sticker = await writeExif({
                    mimetype: metadata.mime,
                    data: data
                }, {
                    packName: config.sticker.packname,
                    packPublish: config.sticker.author
                });
                m.reply({
                    sticker
                });
            } else if (isSticker) {
                const sticker = await writeExif({
                    mimetype: metadata.mime,
                    data: data
                }, {
                    packName: config.sticker.packname,
                    packPublish: config.sticker.author
                });
                m.reply({
                    sticker
                });
            } else {
                await sock.sendMessage(m.cht, {
                    image: data,
                    caption: ``
                }, {
                    quoted: m
                });
            }
        } catch (err) {
            throw err
        }
    }
};