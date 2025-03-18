// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

// Singkat, padat, mantap
// Makasih syaii sudah mau bantuin scrapein ini :v

module.exports = {
    command: "samehadaku",
    alias: [],
    category: ["anime"],
    settigs: {
        limit: true,
    },
    description: "Cek Anime terbaru di Samehadaku",
    async run(m, { sock, Scraper, text, Func, config }) {
        let latest = await Scraper.samehadaku.latest();
        let cap = `*– 乂 Cara penggunaan*
> Masukkan query untuk mencari anime
> Masukkan link untuk mendapatkan data anime

*– 乂 Contoh penggunaan*
> ${m.prefix + m.command} make heroine
> ${m.prefix + m.command} https://samehadaku.email/anime/make-heroine-ga-oosugiru/
> ${m.prefix + m.command} https://samehadaku.email/make-heroine-ga-oosugiru-episode-12/

*– 乂 Berikut ${latest.length} anime yang rilis hari ini*

${latest.map((a) =>
    Object.entries(a).map(([b, c]) => `> *- ${b.capitalize()} :* ${c}`).join("\n")
).join("\n\n")}`;

        if (!text) {
            return sock.sendButton(
                m.cht,
                [{
                    type: "list",
                    title: "🎦 Tab Here",
                    value: [{
                        headers: "– 乂 Anime - Latest",
                        rows: latest.map((a, i) => ({
                            title: `${i + 1}. ${a.title}`,
                            command: `${m.prefix + m.command} ${a.url}`,
                        })),
                    }, ],
                }],
                m, {
                    text: cap,
                    footer: config.name
                }
            );
        }

        if (Func.isUrl(text) && /samehadaku./.test(text)) {
            if (/anime\//.test(text)) {
                let data = await Scraper.samehadaku.detail(text);
                let cap = `*– Anime - Detail*\n`;
                cap += Object.entries(data.metadata)
                    .map(([a, b]) => `> *- ${a} :* ${b}`)
                    .join("\n");
                cap += "\n\n*– 乂 List - Episode*\n";
                cap += data.episode
                    .map((a, i) => `*${i + 1}.* ${a.title}\n> ${a.url}`)
                    .join("\n\n");
                m.reply({
                    image: {
                        url: data.metadata.thumbnail,
                    },
                    caption: cap,
                });
            } else {
                let data = await Scraper.samehadaku.episode(text);
                let quality = Object.keys(data.download);
                let cap = "*– 乂 Anime - Episode*\n";
                cap += Object.entries(data.metadata)
                    .map(
                        ([a, b]) => `> *- ${a} :* ${typeof b === "object" ? b.join(", ") : b}`
                    )
                    .join("\n");                

                let selectedDownload = null;

                // Pastikan ada opsi 720p sebelum mencari Mediafire (RAR)
                if (data.download["720p"]) {
                    selectedDownload = data.download["720p"].find((d) => 
                        d.source.toLowerCase().includes("mediafire (rar)") && 
                        d.url.toLowerCase().endsWith(".rar/file")
                    );
                }

                if (selectedDownload) {
                    try {
                        let mediafireData = await Scraper.mediafire(selectedDownload.url);

                        if (!mediafireData.download) {
                            throw new Error("Link Mediafire tidak ditemukan");
                        }
                                     
                        let buffer = await Func.fetchBuffer(mediafireData.download);

                        await sock.sendMessage(m.cht, {
                            document: buffer,
                            mimetype: "application/x-rar-compressed",
                            fileName: mediafireData.filename,
                            caption: `🎥 *Anime:* ${data.metadata.title}\n🔗 *Source:* Mediafire\n📥 *Quality:* 720p`,
                        }, { quoted: m });

                    } catch (err) {
                        cap += `\n\n⚠️ Gagal mengambil file dari Mediafire:\n${err.message}`;
                        m.reply(cap);
                    }

                } else {
                    cap += "\n\n⚠️ Tidak ada file 720p dari Mediafire dengan format RAR.";
                    m.reply(cap);
                }
            }
        } else {
            let data = await Scraper.samehadaku.search(text);
            if (data.length === 0) throw "> Anime tidak ditemukan";
            let cap = "*– 乂 Anime - Search*\n";
            cap += data
                .map((a) =>
                    Object.entries(a).map(([b, c]) => `> *- ${b.capitalize()} :* ${c}`).join("\n")
                )
                .join("\n\n");
            m.reply(cap);
        }
    },
};