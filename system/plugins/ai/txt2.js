const axios = require("axios");

module.exports = {
    command: "txt2",
    alias: ["txt2"],
    category: ["ai"],
    settings: {
        limit: true
    },
    loading: true,
    description: "Membuat gambar dari teks dengan berbagai style",
    async run(m, {
        sock,
        text
    }) {
        if (!text) return m.reply("⚠ Masukkan prompt!\n\n> *Contoh:* txt2 --disney Promptmu --wide");

        let match = text.match(/--(comic|disney|kawaii|mangga)/i);
        let type = match ? match[1].toLowerCase() : "comic";

        let resolutionMatch = text.match(/--(Square|Wide|Potrait)/i);
        let resolution = resolutionMatch ? resolutionMatch[1] : "Square";

        let prompt = text.replace(/--(comic|disney|kawaii|mangga)/i, "").replace(/--(Square|Wide|Potrait)/i, "").trim();
        if (!prompt) return m.reply("⚠ Masukkan teks untuk dijadikan gambar!");

        let apiUrl = `https://api.maelyn.tech/api/txt2${type}`;
        let apiKey = "08zkM7JSKh";

        try {
            let {
                data
            } = await axios.get(apiUrl, {
                params: {
                    prompt,
                    resolution,
                    apikey: apiKey
                }
            });

            if (data.status !== "Success") return m.reply("❌ Gagal mengambil gambar!");

            let images = data.result.slice(0, 2);

            if (images.length < 2) return m.reply("⚠ API hanya mengembalikan satu gambar.");

            let caption = `🎨 *Text-to-Image (${type.toUpperCase()})*\n` +
                `📌 *Prompt:* ${prompt}\n` +
                `📏 *Resolution:* ${resolution}\n` +
                `🌐 *Powered by Maelyn API*`;

            await sock.sendMessage(m.cht, {
                image: {
                    url: images[0]
                },
                caption
            }, {
                quoted: m
            });
            return sock.sendMessage(m.cht, {
                image: {
                    url: images[1]
                },
                caption
            }, {
                quoted: m
            });

        } catch (error) {
            return m.reply("❌ Terjadi kesalahan, coba lagi nanti!");
        }
    },
};