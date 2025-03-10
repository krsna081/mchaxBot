// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const mimeAudio = 'audio/mpeg';
const mimeVideo = 'video/mp4';
const mimeImage = 'image/jpeg';

module.exports = {
    command: "upsw",
    alias: ["upsw"],
    category: ["owner"],
    settings: {
        owner: true,
    },
    description: "Tag status group WhatsApp",
    loading: false,
    async run(m, { sock, store, config, Uploader, text }) {
        if (!m.quoted) {
            throw "> 📸 *Balas dengan gambar, video, audio, stiker, atau pesan untuk mengirimkan ke status.*";
        }

        const mtype = m.quoted.mtype || m.quoted.type;
        let type;
        if (mtype === 'audioMessage') {
            type = 'Voice Note';
        } else if (mtype === 'videoMessage') {
            type = 'Video';
        } else if (mtype === 'imageMessage') {
            type = 'Image';
        } else if (mtype === 'conversation') {
            type = 'Text';
        } else if (mtype === 'stickerMessage') {
            type = m.quoted.msg?.isAnimated ? 'Video' : 'Image';
        } else {
            throw "> ❌ *Media type tidak valid!*";
        }

        const doc = {};
        if (mtype !== 'conversation') {
            const buffer = await m.quoted.download();
            const bkp = await Uploader.catbox(buffer);

            if (type === 'Voice Note') {
                doc.mimetype = mimeAudio;
                doc.ptt = true;
                doc.audio = { url: bkp };
            } else if (type === 'Video') {
                doc.mimetype = mimeVideo;
                doc.caption = m.quoted.text || "";
                doc.video = { url: bkp };
            } else if (type === 'Image') {
                doc.mimetype = mimeImage;
                doc.caption = m.quoted.text || "";
                doc.image = { url: bkp };
            }
        } else {
            doc.text = m.quoted.text || "";
        }

        if (text && text.endsWith("@g.us")) {
            let gc;
            try {
                gc = await sock.groupMetadata(text);
            } catch (e) {
                throw "> ❌ *ID grup tidak valid!*";
            }

            const groupName = gc.subject;
            const participantCount = gc.participants.length;
            const tag = gc.participants.map(a => a.id);

            return sock.sendStatus([text], doc)
                .then((res) => {
                    sock.sendAlbumMessage(text, [{ image: { url: "https://example.com/image1.jpg" }, caption: "" }], { quoted: res, mentions: tag });
                    sock.sendMessage(m.chat, { text: `> ✅ *Sukses upload ${type} di grup "${groupName}" dengan ${participantCount} peserta!*` }, { quoted: res || null });
                })
                .catch((e) => {
                    m.reply(`> ❌ *Gagal upload ${type} di grup "${groupName}".*\n\n${e.message || e}`);
                });
        }

        let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640'];
        let fonts = [0, 1, 2, 6, 7, 8, 9, 10];

        const contacts = store?.contacts ? Object.keys(store.contacts).filter(jid => jid.trim() !== "") : [];

        await sock.sendMessage("status@broadcast", doc, {
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                textArgb: 0xffffffff,
                font: fonts[Math.floor(Math.random() * fonts.length)],
                statusJidList: contacts,
            })
            .then((res) => {
                sock.sendMessage(m.chat, { text: `> ✅ *Sukses upload ${type} ke status dengan ${contacts.length} peserta!*` }, { quoted: res || null });
            })
            .catch((e) => {
                m.reply(`> ❌ *Gagal upload ${type} ke status!*\n\n${e.message || e}`);
            });
    },
};

async function generateVoice(Locale = "id-ID", Voice = "id-ID-ArdiNeural", Query) {
    const formData = new FormData();
    formData.append("locale", Locale);
    formData.append("content", `<voice name="${Voice}">${Query}</voice>`);
    formData.append("ip", '46.161.194.33');

    const response = await require('node-fetch')('https://app.micmonster.com/restapi/create', {
        method: 'POST',
        body: formData
    });
    return Buffer.from(('data:audio/mpeg;base64,' + await response.text()).split(',')[1], 'base64');
}