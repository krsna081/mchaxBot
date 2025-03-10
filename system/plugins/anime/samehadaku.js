// Singkat, padat, mantap
// Makasih syaii sudah mau bantuin scrapein ini :v

module.exports = {
    command: "samehadaku",
    alias: [],
    category: ["anime"],
    settigs: {
        limit: true,
    },
    description: "Cek Anime terbaru di samehadaku",
    async run(m, {
        sock,
        Scraper,
        text,
        Func,
        config
    }) {
        let latest = await Scraper.samehadaku.latest();
        let cap = `*– 乂 Cara penggunaan*
> Masukan query untuk mencari anime
> Masukan link untuk mendapatkan data anime

*– 乂 Contoh - penggunaan*
> ${m.prefix + m.command} make heroine
> ${m.prefix + m.command} https://samehadaku.email/anime/make-heroine-ga-oosugiru/
> ${m.prefix + m.command} https://samehadaku.email/make-heroine-ga-oosugiru-episode-12/

*– 乂 Berikut ${latest.length} anime yang rilis hari ini*

${latest
  .map((a) =>
    Object.entries(a)
      .map(([b, c]) => `> *- ${b.capitalize()} :* ${c}`)
      .join("\n"),
  )
  .join("\n\n")}`;
        if (!text)
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
                }, ],
                m, {
                    text: cap,
                    footer: config.name
                },
            );
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
                        ([a, b]) =>
                        `> *- ${a} :* ${typeof b === "object" ? b.join(", ") : b}`,
                    )
                    .join("\n");
                if (quality.length > 1) {
                    cap += "\n\n*– 乂 Download - Episode*\n";
                    for (let i of quality) {
                        cap += `> *- Download ${i}*\n`;
                        cap += data.download[i]
                            .map((a) => `> *- Source :* ${a.source}\n> *- Url :* ${a.url}`)
                            .join("\n");
                        cap += "\n\n";
                    }
                } else {
                    cap += "\n\ntidak ada link download pada episode ini";
                }
                m.reply(cap);
            }
        } else {
            let data = await Scraper.samehadaku.search(text);
            if (data.length === 0) throw "> Anime tidak ditemukan";
            let cap = "*– 乂 Anime - Search*\n";
            cap += data
                .map((a) =>
                    Object.entries(a)
                    .map(([b, c]) => `> *- ${b.capitalize()} :* ${c}`)
                    .join("\n"),
                )
                .join("\n\n");
            m.reply(cap);
        }
    },
};