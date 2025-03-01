const yts = require("yt-search");
const axios = require("axios");

module.exports = {
    command: "ytmp3",
    alias: ["play", "yta"],
    category: ["downloader"],
    settings: {
        limit: true,
    },
    description: "Cari dan unduh audio dari YouTube",
    async run(m, {
        sock,
        Func,
        config,
        text
    }) {
        if (!text) {
            return m.reply(
                `╭──[❌ *Masukkan Input yang Valid* ]
᎒⊸ Ketik teks untuk mencari video YouTube, atau masukkan link YouTube yang valid.
᎒⊸ Contoh: *${m.prefix}play Lathi* atau *${m.prefix}play https://youtu.be/abc123*
╰────────────•`,
            );
        }

        m.reply(`╭──[⏳ *Sedang Diproses* ]
᎒⊸ *Mohon tunggu sebentar...*
╰────────────•`);

        let isUrl = Func.isUrl(text);
        let videoUrl;

        if (isUrl) {
            videoUrl = isUrl[0];
        } else {
            let searchResult = await yts(text);
            let randomVideo = searchResult.videos.getRandom();
            if (!randomVideo) {
                return m.reply(
                    `╭──[❌ *Hasil Tidak Ditemukan* ]
᎒⊸ Tidak ada video ditemukan dengan kata kunci *"${text}"*. Coba gunakan kata kunci lain!
╰────────────•`,
                );
            }
            videoUrl = randomVideo.url;
        }

        let {
            data
        } = await axios
            .get(`https://api.betabotz.eu.org/api/download/yt?url=${videoUrl}&apikey=krizz`)
            .catch((e) => e.response);

        if (!data?.result) {
            return m.reply(
                `╭──[❌ *Terjadi Kesalahan* ]
᎒⊸ Tidak dapat memproses permintaan Anda. Coba lagi nanti atau gunakan URL lain.
╰────────────•`,
            );
        }

        let metadata = data.result;
        metadata.thumb = metadata.thumb;

        let cap = `╭──[🎵 *YouTube - Audio Downloader* ]
 ${Object.entries(metadata)
   .map(([a, b]) => `᎒⊸ *${a.capitalize()}*       : ${b}`)
   .join("\n")}
╰────────────•

📝 *Catatan:*
᎒⊸ Anda akan menerima thumbnail dan file audio dari video ini.
᎒⊸ Jika file audio tidak terkirim, periksa URL atau coba lagi nanti.

🔗 *Link Video*: ${videoUrl}
${config.name}`;

        sock
            .sendMessage(
                m.cht, {
                    image: {
                        url: metadata.thumb
                    },
                    caption: cap,
                }, {
                    quoted: m
                },
            )
            .then((sent) => {
                sock.sendMessage(
                    m.cht, {
                        audio: {
                            url: metadata.mp3
                        },
                        mimetype: "audio/mpeg",
                    }, {
                        quoted: sent
                    },
                );
            });
    },
};