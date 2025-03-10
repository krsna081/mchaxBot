// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

module.exports = {
    command: "maelyn",
    alias: ["maelyn", "mael"],
    category: ["ai"],
    description: "Jawab semua pertanyaanmu dengan AI",
    loading: true,
    async run(m, { text, sock, Scraper, Uploader }) {
        if (!text) return m.reply(`> Masukkan pertanyaan atau perintah AI.`);

        let isCreate = text.startsWith("create ");
        let query = isCreate ? text.replace("create ", "") : text;
        let apiUrl = "https://api.maelyn.tech/api/maelynai/chat";
        let imageUrl = "";

        if (m.quoted && m.quoted.mimetype?.startsWith("image/")) {
            let buffer = await m.quoted.download();
            imageUrl = await Uploader.catbox(buffer);
        } else if (m.msg.mimetype?.startsWith("image/")) {
            let buffer = await m.download();
            imageUrl = await Uploader.catbox(buffer);
        }

        try {
            let response = await axios.get("https://api.maelyn.tech/api/maelynai/chat", {
                params: {
                    "q": query,
                    "url": "",
                    "roleplay": "Kamu adalah NekoBot, asisten virtual berbasis kecerdasan buatan yang dikembangkan menggunakan Node.js oleh Krisnoll. Kamu ramah, cerdas, dan selalu siap membantu pengguna dengan informasi, percakapan, serta pembuatan gambar AI.",
                    "uuid": "maelynai-0d125044-7673-43bf-b9cd-e94e6fa8997d",
                    "apikey": "08zkM7JSKh"
                }
            });

            let { content, imageUrl: aiImageUrl } = response.data.result;

            if (isCreate) {
                if (aiImageUrl) {
                    await sock.sendFile(m.cht, aiImageUrl, "ai-image.png", content || "Berikut gambar yang dibuat AI", m);
                } else {
                    m.reply("AI tidak dapat membuat gambar untuk permintaan ini.");
                }
            } else {
                m.reply(content || "Aku tidak bisa menemukan jawaban untuk itu.");
            }
        } catch (error) {
            console.error(error);
            m.reply("Terjadi kesalahan saat menghubungi AI. Coba lagi nanti.");
        }
    },
};