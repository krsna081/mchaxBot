// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    downloadContentFromMessage
} = require('baileys');

module.exports = {
    command: "readvo",
    alias: ["rvo", "torvo"],
    category: ["tools"],
    settings: {
        limit: true
    },
    description: "Melihat ulang atau membuat pesan 1× lihat",
    loading: false,
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        if (!m.quoted) return m.reply(`> *Balas pesan media (gambar/video/audio) yang bersifat 1× lihat atau biasa.*`);

        try {
            let msg = m.quoted.message;
            let type = Object.keys(msg)[0];

            let mediaType = type === 'imageMessage' ? 'image' :
                type === 'videoMessage' ? 'video' :
                'audio';

            let media = await downloadContentFromMessage(msg[type], mediaType);
            let buffer = Buffer.from([]);

            for await (const chunk of media) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (/videoMessage/.test(type)) {
                return sock.sendMessage(m.cht, {
                    video: buffer,
                    caption: msg[type].caption || "",
                    viewOnce: m.command === "torvo"
                }, {
                    quoted: m
                });
            } else if (/imageMessage/.test(type)) {
                return sock.sendMessage(m.cht, {
                    image: buffer,
                    caption: msg[type].caption || "",
                    viewOnce: m.command === "torvo"
                }, {
                    quoted: m
                });
            } else if (/audioMessage/.test(type)) {
                return sock.sendMessage(m.cht, {
                    audio: buffer,
                    mimetype: "audio/mpeg",
                    ptt: true,
                    viewOnce: m.command === "torvo"
                }, {
                    quoted: m
                });
            }

        } catch (e) {
            throw `> *Balas pesan media (gambar/video/audio) yang bersifat 1× lihat atau biasa.*`;
        }
    },
};