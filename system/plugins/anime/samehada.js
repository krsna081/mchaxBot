module.exports = {
    command: "samehada",
    alias: ["samehadaku"],
    category: ["anime"],
    settings: {},
    description: "Cari dan dapatkan detail anime dari Samehada.",
    loading: false,
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
        let fitur = ["search", "detail", "episode"];
        if (!text) {
            let latest = await Scraper.samehada.latest();
            let cap = `*– 乂 **Panduan Penggunaan Fitur**:*\n
> 📝 *Masukkan nama anime* untuk mencari anime yang sedang tren\n
> 🔗 *Masukkan URL* untuk mendapatkan data anime lengkap langsung dari Samehada\n
> 🎬 *Masukkan URL episode* untuk mengunduh anime langsung\n

*– 乂 **Contoh Penggunaan**:*\n
> ➡️ *${m.prefix + m.command} search Toradora*\n
> ➡️ *${m.prefix + m.command} detail https://samehadaku.sbs/anime/toradora*\n
> ➡️ *${m.prefix + m.command} episode https://samehadaku.sbs/episode/toradora-1*\n

*– 乂 **Anime yang Rilis Hari Ini** (${latest.length} Anime):*\n
${latest.map((a) =>
        Object.entries(a)
          .map(([b, c]) => `> 🔸 *${b.capitalize()}* : ${c}`)
          .join("\n"),
      )}`.join("\n\n")

            return m.reply(cap);
        }

        let args = text.split(" ");
        let feature = args[0].toLowerCase();
        let query = text.slice(feature.length + 1);

        if (!fitur.includes(feature)) return m.reply("*⚠️ Perintah tidak ditemukan!*");

        if (feature === "search") {
            if (!query) return m.reply(`> *📌 Contoh:* ${m.prefix + m.command} search Toradora`);

            try {
                let result = await Scraper.samehada.search(query);
                let response = `*– 乂 **Hasil Pencarian** - Samehada*\n` + result
        .map((a) =>
          Object.entries(a)
            .map(([b, c]) => `> 🔸 *${b.capitalize()}* : ${c}`)
            .join("\n"),
        )
        .join("\n\n");

                return m.reply(response, result[0].img);
            } catch (error) {
                return m.reply("❌ *Gagal mencari anime!*");
            }
        }

        if (feature === "detail") {
            if (!query) return m.reply(`> *📌 Contoh:* ${m.prefix + m.command} detail [url]`);
            if (Func.isUrl(text) && /samehadaku./.test(text)) {
            if (/anime\//.test(text)) {      
            try {
                let anime = await Scraper.samehada.detail(query);
                let response = `*– 乂 **Detail Anime - Samehada*\n> 🔸 *Nama* : ${anime.title}\n` +
                    `> 🔸 *Skor* : ${anime.rating}\n> 🔸 *Genre* : ${anime.genres.join(", ")}\n> 🔸 *Deskripsi* : ${anime.description || "-"}\n\n` +
                    `*– 乂 **Daftar Episode**:*\n${anime.episodes.map((ep, i) => `> 📺 *${i + 1}.* ${ep.title}\n> 🗓️ ${ep.date}\n> 🔗 ${ep.url}`).join("\n\n")}`;

                return await sock.sendFile(m.cht, anime.image, "", response, m);
            } catch (error) {
                return m.reply("❌ *Gagal mengambil detail anime!*");
            }
        }
        }
        }

        if (feature === "episode") {
            if (!query) return m.reply(`> *📌 Contoh:* ${m.prefix + m.command} episode [url]`);
            if (Func.isUrl(text) && /samehadaku./.test(text)) {
            if (/episode\//.test(text)) {
            m.reply("📥 *Mengunduh episode...*");

            try {
                let video = await Scraper.samehada.download(query);
                let mp4 = video.unduhan.find((d) => d.tautan.endsWith(".mp4"));

                if (!mp4) return m.reply("⚠️ *Tidak ditemukan link download video!*");

                let caption = `*– 乂 **Samehada Downloader***\n> 🎬 *${video.judul}*\n> 🔗 *URL* : ${video.url}\n> 📺 *Resolusi* : ${mp4.nama}\n> 📥 *Download* : ${mp4.tautan}`;
                let message = await sock.sendMessage(m.cht, { text: caption });

                return await sock.sendMessage(m.cht, {
                    document: { url: mp4.tautan },
                    caption: video.url,
                    fileName: `${video.judul}.mp4`,
                    mimetype: "video/mp4"
                }, { quoted: message });

            } catch (error) {
                return m.reply("❌ *Gagal mengunduh episode!*");
            }
          }
          }
        }
    }
};