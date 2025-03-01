class Command {
    constructor() {
        this.command = "gcsearch";
        this.alias = ["gcs"];
        this.category = ["group"];
        this.settings = {};
        this.description = "Cari grup WhatsApp berdasarkan nama atau lihat detailnya.";
    }

    run = async (m, { sock, Func, Scraper }) => {
        if (!m.args[0]) {
            return m.reply("⚠️ Gunakan perintah: gc --search <nama_grup> atau gc --detail <link_grup>");
        }

        if (m.args[0] === "--search") {
            if (!m.args[1]) return m.reply("⚠️ Masukkan nama grup yang ingin dicari.");
            let query = m.args.slice(1).join(" ");
            m.reply(`🔍 Mencari grup dengan nama: *${query}*...`);

            try {
                let results = await Scraper.wgl.search(query);
                if (!results || results.length === 0) return m.reply("❌ Tidak ditemukan grup yang cocok.");

                let text = "📌 *Hasil Pencarian Grup:*\n\n";
                for (let group of results) {
                    text += `🔹 *${group.title}*\n📅 Tanggal: ${group.date}\n🔗 [Lihat Detail](${group.link})\n\n`;
                }

                m.reply(text, {
                    contextInfo: {
                        externalAdReply: {
                            title: "🔍 Hasil Pencarian Grup",
                            thumbnailUrl: results[0]?.image || "",
                            mediaType: 1
                        }
                    }
                });
            } catch (e) {
                console.error(e);
                m.reply("❌ Terjadi kesalahan saat mencari grup.");
            }
        } else if (m.args[0] === "--detail") {
            if (!m.args[1]) return m.reply("⚠️ Masukkan link grup yang ingin dilihat detailnya.");
            let link = m.args[1];

            m.reply("🔍 Mengambil detail grup...");

            try {
                let detail = await Scraper.wgl.detail(link);
                if (!detail) return m.reply("❌ Tidak ditemukan detail untuk grup ini.");

                let text = `📌 *Detail Grup*\n\n📖 *Deskripsi:*\n${detail.desc}\n\n📜 *Aturan:*\n`;
                text += detail.rules.map((rule, i) => `  ${i + 1}. ${rule}`).join("\n") + "\n\n";

                text += "🔗 *Tautan Grup:*\n";
                text += detail.links.map(link => `  🔹 [${link.title}](${link.link})`).join("\n") + "\n\n";

                text += "📢 *Grup Terkait:*\n";
                text += detail.related.map(link => `  🔹 [${link.title}](${link.link})`).join("\n");

                m.reply(text, {
                    contextInfo: {
                        externalAdReply: {
                            title: "📜 Detail Grup WhatsApp",
                            thumbnailUrl: detail.links[0]?.link || "",
                            mediaType: 1
                        }
                    }
                });
            } catch (e) {
                console.error(e);
                m.reply("❌ Terjadi kesalahan saat mengambil detail grup.");
            }
        } else {
            m.reply("⚠️ Gunakan perintah: gc --search <nama_grup> atau gc --detail <link_grup>");
        }
    };
}

module.exports = new Command();