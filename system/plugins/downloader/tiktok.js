let neko = async (m, { sock, Func, Scraper, Uploader, store, text, config }) => {
    if (!text.includes("tiktok"))
        return m.reply("❌ *Link TikTok tidak ditemukan! Masukkan link yang valid.*");

    try {
        let a = await Scraper.ttsave.video(text);
        let caption = `*– 乂 TikTok - Downloader 🎥*\n`;
        caption += `> 📛 *Nama:* ${a.nickname}\n`;
        caption += `> 🧑‍💻 *Username:* ${a.username}\n`;
        caption += `> 🆔 *Username ID:* ${a.uniqueId}\n`;
        caption += `> 👁️ *Views:* ${a.stats.plays}\n`;
        caption += `> ❤️ *Likes:* ${a.stats.likes}\n`;
        caption += `> 💬 *Komentar:* ${a.stats.comments}\n`;
        caption += `> 🔄 *Bagikan:* ${a.stats.shares}\n`;
        caption += `⏤͟͟͞͞╳`;

        if (a.slides && a.slides.length > 0) {
            for (let i of a.slides) {
                await sock.sendMessage(m.cht, {
                    image: { url: i.url },
                    caption,
                }, { quoted: m });
            }
        } else if (a.dlink && a.dlink.nowm) {
            await sock.sendMessage(m.cht, {
                video: { url: a.dlink.nowm },
                caption,
            }, { quoted: m });
        }

        let u = await Scraper.ttsave.mp3(text);
        const contextInfo = {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 127,
            externalAdReply: {
                title: Func.Styles(`${u.songTitle}`),
                body: Func.Styles(`${u.username}`),
                mediaType: 1,
                thumbnailUrl: u.coverUrl,
                sourceUrl: u.audioUrl,
                renderLargerThumbnail: false,
            },
        };

        await sock.sendMessage(m.cht, {
            audio: { url: u.audioUrl },
            mimetype: "audio/mpeg",
            contextInfo,
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        return m.reply("❌ *Terjadi kesalahan saat mengambil data dari TikTok!*");
    }
};

neko.command = "tiktok";
neko.alias = ["tt", "ttdl", "tiktokdl"];
neko.category = ["downloader"];
neko.settings = { limit: true };
neko.description = "📥 Download video atau slide dari TikTok.";
neko.loading = true;

module.exports = neko;