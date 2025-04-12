// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

//© Bentala - Bot
// • Credits : wa.me/6282258713880 [ Renjana ]
// • Owner: 6282258713880

/*
• Telegram: Renjana_ex
• Instagram: Renjana.ex
*/

const {
    execSync
} = require("child_process");
const {
    fromBuffer
} = require("file-type");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const {
    writeExif
} = require(process.cwd() + "/lib/sticker.js");

module.exports = {
    command: "furbrat",
    alias: ["hikagen"],
    category: ["tools"],
    settings: {
        limit: true
    },
    description: "🐾 Membuat Brat versi furry :v",
    async run(m, {
        sock,
        text,
        config,
        Func
    }) {
        const idMatch = m.args.find(arg => arg.startsWith("--id="));
        let style = idMatch ? parseInt(idMatch.split("=")[1]) : Func.random([1, 2, 3, 4, 5, 6, 7])
        const isSticker = m.args.includes("--sticker");
        const isAnimated = m.args.includes("--animated");
        const prompt = text.replace(/--\w+(\=\w+)?/g, "").trim();

        if (!prompt) return m.reply(`⚠️ Masukkan teks!\nContoh: *.furbrat Halo Dunia --id=3 --sticker*\n\nOpsi:\n- *--id=<angka>*: Pilih style (1-7, default: random).\n- *--sticker*: Hasilnya jadi stiker.\n- *--animated*: Buat stiker animasi.`);

        if (isAnimated) style = 1; // Jika animated, pakai style default 1

        const apiUrl = `https://restapi.krizz.my.id/maker/furbrat?text=${encodeURIComponent(prompt)}&style=${style}&mode=${isAnimated ? "animated" : "image"}`;
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
                    caption: `🐾 Furbrat Style ${style}`
                }, {
                    quoted: m
                });
            }
        } catch (err) {
            throw err
        }
    }
};