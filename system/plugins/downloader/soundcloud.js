// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    fetch
} = require("undici");

class Command {
    constructor() {
        this.command = "soundcloud";
        this.alias = ["sound", "scloud"];
        this.category = ["downloader"];
        this.settings = {
            limit: true,
        };
        this.description = "🎵 Mencari dan mengunduh musik dari SoundCloud!";
        this.loading = true;
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        store,
        text
    }) => {
        if (!text)
            throw (
                `*– 乂 Cara Penggunaan 🎶*\n\n` +
                `> Masukkan kata kunci untuk mencari musik\n` +
                `> Masukkan URL SoundCloud untuk mengunduh musik\n\n` +
                `*– 乂 Contoh Penggunaan 📋*\n` +
                `> ${m.prefix}soundcloud Imagine Dragons\n` +
                `> ${m.prefix}soundcloud https://soundcloud.com/artist-name/track-name`
            );

        if (Func.isUrl(text)) {
            if (!/soundcloud.com/.test(text))
                throw `> *❌ Masukkan URL SoundCloud yang valid!*`;

            let data = await Scraper.soundcloud.download(text);
            let cap = `*– 乂 SoundCloud - Downloader 🎵*\n\n`;
            cap += Object.entries(data)
                .map(([a, b]) => `> *🎧 ${a.capitalize()} :* ${b}`)
                .join("\n");

            sock.sendMessage(m.cht, {
                image: {
                    url: data.cover
                },
                caption: cap
            }, {
                quoted: m
            }).then((msg) => {
                setTimeout(() => {
                    sock.sendMessage(m.cht, {
                        audio: {
                            url: data.url
                        },
                        mimetype: "audio/mp4",
                    }, {
                        quoted: msg
                    });
                }, 4000);
            })
        } else {
            let data = await Scraper.soundcloud.search(text);
            if (data.result.length === 0) throw `> *❌ Musik tidak ditemukan!*`;
            data.result = data.result.slice(0, 50);

            let cap =
                `*– 乂 SoundCloud - Pencarian 🔎*\n\n` +
                `> Pilih lagu yang ingin kamu unduh!\n\n`;
            cap += data.result
                .map((i) => `> *🎵 Judul :* ${i.title}\n> *👤 Author :* ${i.author}\n> *⏳ Durasi :* ${i.duration}\n> *🔃 Diputar Ulang :* ${i.playback_count}\n> *👍 Like :* ${i.total_likes}\n> *🔗 URL :* ${i.url}`)
                .join("\n\n");

            m.reply(cap);
        }
    };
}

module.exports = new Command();