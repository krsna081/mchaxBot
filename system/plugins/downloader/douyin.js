// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

class Command {
    constructor() {
        this.command = "douyin";
        this.alias = ["dydl"];
        this.category = ["downloader"];
        this.settings = {};
        this.description = "Download video dari Douyin tanpa watermark.";
    }

    run = async (m, { sock, Func, text }) => {
        let douyinRegex = /^https?:\/\/(?:www\.)?(douyin\.com|v\.douyin\.com)\/\S+/;
        if (!text || !douyinRegex.test(text)) {
            return m.reply("❌ Masukkan link video Douyin yang valid!");
        }

        let api = "https://lovetik.app/api/ajaxSearch";
        let payload = { q: text, lang: "en" };

        try {
            let { data } = await axios.post(api, payload, {
                headers: {
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    origin: "https://lovetik.app",
                    referer: "https://lovetik.app/en",
                    "x-requested-with": "XMLHttpRequest",
                },
                transformRequest: [
                    (data) =>
                        Object.keys(data)
                            .map(
                                (key) =>
                                    `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
                            )
                            .join("&"),
                ],
            });

            if (!data || !data.data) {
                return m.reply("❌ Gagal mendapatkan data dari API!");
            }

            let extractData = data.data;
            let downloadUrls =
                extractData.match(
                    /https:\/\/(dl\.snapcdn\.app|v\d+-cold\.douyinvod\.com)\/get\?token=[^"]+/g
                ) || [];

            if (downloadUrls.length === 0) {
                return m.reply("❌ Gagal mendapatkan link download!");
            }

            let videoUrl = downloadUrls.find((url) => url.includes("douyinvod.com")) || downloadUrls[0];

            await sock.sendMessage(
                m.cht,
                { video: { url: videoUrl }, caption: "🎥 Berikut video Douyin tanpa watermark." },
                { quoted: m }
            );
        } catch (err) {
            console.error("Error saat mengunduh video Douyin:", err);
            return m.reply("❌ Terjadi kesalahan saat mengunduh video.");
        }
    };
}

module.exports = new Command();