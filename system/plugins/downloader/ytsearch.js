// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const yt = require("yt-search");

module.exports = {
  command: "ytsearch",
  alias: ["yts", "ytsearch"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "🔍 Cari video menarik dari YouTube berdasarkan kata kunci",
  loading: true,
  async run(m, { sock, text }) {
    if (!text) {
      throw "> ❌ *Masukkan kata kunci untuk mencari video YouTube.*";
    }

    let data = await yt.search(text);
    if (!data || !data.videos || data.videos.length === 0) {
      throw `❌ *– Pencarian Gagal!*\n\n⚠️ Tidak ada hasil ditemukan untuk kata kunci: *${text}*.\n\n🔎 *Tips:*\n- Gunakan kata kunci yang lebih spesifik.\n- Pastikan ejaan kata kunci benar.\n\n📖 *Contoh:*\n> *${m.prefix}${m.command} video lucu*`;
    }

    let videos = data.videos.slice(0, 10); // Ambil 10 hasil pertama
    let thumbnail = videos[0]?.thumbnail || "https://i.imgur.com/4M34hi2.png"; // Thumbnail dari video pertama

    let caption = `*– 乂 YouTube - Pencarian 🔍*\n\n`;
    caption += videos
      .map(
        (video, i) =>
          `📌 *${i + 1}. ${video.title}*\n📎 *URL:* ${video.url}\n⏳ *Durasi:* ${
            video.timestamp || "Tidak tersedia"
          }\n📺 *Channel:* ${video.author.name}\n👁️ *Views:* ${video.views.toLocaleString()}\n`
      )
      .join("\n──────────\n");

    await sock.sendMessage(
      m.cht,
      {
        image: { url: thumbnail },
        caption,
      },
      { quoted: m }
    );
  },
};