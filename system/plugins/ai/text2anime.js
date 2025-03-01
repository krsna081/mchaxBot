const axios = require("axios");

module.exports = {
    command: "text2anime",
    alias: ["txt2anime"],
    category: ["ai"],
    settings: { limit: true },
    description: "Membuat gambar anime dengan prompt!",
    loading: true,
    async run(m, { sock, text }) {
        if (!text) return m.reply("> ✍️ *Mohon masukkan prompt!*");

        const match = text.match(/--(\d+)$/);
        let totalImages = match ? parseInt(match[1]) : 1;
        if (totalImages > 10) return m.reply("> ❌ *Maksimum hanya 10 gambar!*");

        const prompt = match ? text.replace(match[0], '').trim() : text.trim();
        if (!prompt) return m.reply("> ❌ *Prompt tidak valid!*");

        let allImages = [];

        try {
            for (let i = 0; i < totalImages; i++) {
                let result = await sdxlAnime(prompt);
                if (result.status && result.image) {
                    allImages.push(result.image);
                } else {
                    throw new Error(result.message || "Gagal menghasilkan gambar.");
                }
            }

            await m.reply(`> ✍️ *Prompt:* ${prompt}`);

            for await (let imgUrl of allImages) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await sock.sendMessage(m.cht, {
                    image: { url: imgUrl }
                }, { quoted: m });
            }
        } catch (e) {
            m.reply(`> ❌ *Error:* ${e.message || e}`);
        }
    }
};

/*
  Created by https://github.com/ztrdiamond !
  Source: https://whatsapp.com/channel/0029VagFeoY9cDDa9ulpwM0T
  "Aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/

async function sdxlAnime(prompt) {
    try {
        if (!prompt) throw new Error("Prompt tidak boleh kosong!");

        const { data } = await axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
            prompt,
            key: "Soft-Anime",
            width: 512,
            height: 768,
            quantity: 1,
            size: "512x768"
        });

        if (data.code !== 0) throw new Error(data.message);
        if (data.data.safetyState === "RISKY") throw new Error("NSFW image detected, coba gunakan prompt lain!");
        if (!data.data?.url) throw new Error("Gagal menghasilkan gambar!");

        return { status: true, image: data.data.url };
    } catch (e) {
        return { status: false, message: e.message || e };
    }
}