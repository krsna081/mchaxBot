module.exports = {
    command: ["tomp3", "tovn"],
    alias: ["tomp3", "tovn", "toptt"],
    category: ["tools"],
    settings: {},
    description: "Mengubah video menjadi pesan suara atau audio.",
    loading: true,
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        let q = m.quoted ? m.quoted : m;
        let mime = q.msg.mimetype;

        if (/mp3|a(udio)?$/i.test(m.command)) {
            if (!/video|audio/.test(mime))
                throw "> *🎤 Balas video atau audio yang ingin diubah.*";

            let media = await q.download();
            if (!media) return;
            await sock.sendMessage(m.cht, {
                audio: media,
                mimetype: "audio/mpeg",
                ptt: false
            }, {
                quoted: m
            });
        }

        if (/vn|ptt$/i.test(m.command)) {
            if (!/video|audio/.test(mime))
                throw "> *🎤 Balas video atau audio yang ingin diubah.*";

            let media = await q.download();
            if (!media) return;
            await sock.sendMessage(m.cht, {
                audio: media,
                mimetype: "audio/mp4",
                ptt: true
            }, {
                quoted: m
            });
        }
    },
};