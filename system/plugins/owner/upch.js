module.exports = {
    command: "upch",
    alias: ["upch"],
    category: ["owner"],
    settings: {
        owner: true
    },
    description: "Upload gambar, video, audio, & text kedalam saluran.",
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
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || "";

        if (!text) throw `*– 乂 Cara Penggunaan Upch (Upload Saluran)*

> *\`${m.prefix}upch\`* - Balas mimetype dengan disertai link saluran (Tidak ada caption)
> *\`${m.prefix}upch\`* - Balas mimetype dengan disertai link saluran lalu tambah kata di belakang untuk caption (Kalau itu audio caption biru di atas)`

        let [linkChannel, ...captionArray] = text.split(' ');

        if (!Func.isUrl(linkChannel)) throw `*[ ! ]* Input URL not valid. Please provide a valid channel link.`;

        const url = new URL(linkChannel);
        const id = url.pathname.split('/')[2];
        if (!id) throw `*[ ! ]* Channel ID not found. Please check the URL.`;

        let data;
        try {
            data = await sock.newsletterMetadata("invite", id);
        } catch (e) {
            throw `*[ ! ]* Failed to retrieve channel data. Please check the channel link.`;
        }

        let hai = await sock.newsletterMetadata("jid", data.id);
        if (hai.viewer_metadata.role === 'SUBSCRIBER') {
            return m.reply(`*[ ! ]* Bot does not have admin access rights on this channel. Please make bot an admin to continue.`);
        }

        let caption = captionArray.join(' ') || "";
        let {
            key
        } = await sock.sendMessage(m.cht, {
            text: "Uploading..."
        }, {
            quoted: m
        });

        try {
            if (mime.includes("audio")) {
                await sock.sendMessage(data.id, {
                    audio: await q.download(),
                    mimetype: "audio/mp4",
                    ptt: true,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: data.id,
                            serverMessageId: 173,
                            newsletterName: caption || data.name,
                        },
                    },
                });
                await sock.sendMessage(m.cht, {
                    text: `• Successfully sent audio with mimetype: *[ ${mime} ]*`,
                    edit: key
                }, {
                    quoted: m
                });
            } else if (mime.includes("webp")) {
                await sock.sendMessage(data.id, {
                    sticker: await q.download(),
                    contextInfo: {
                        isForwarded: true,
                        externalAdReply: {
                            title: data.name,
                            body: null,
                            thumbnailUrl: "https://pps.whatsapp.net" + data.preview || await sock.profilePictureUrl(m.sender, 'image').catch(e => icon),
                            mediaType: 1,
                            renderLargerThumbnail: false,
                            sourceUrl: null
                        },
                    },
                });
                await sock.sendMessage(m.cht, {
                    text: `• Successfully sent sticker with mimetype: *[ ${mime} ]*`,
                    edit: key
                }, {
                    quoted: m
                });
            } else if (mime.includes("image")) {
                await sock.sendMessage(data.id, {
                    image: await q.download(),
                    caption: caption || q.text,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: data.id,
                            serverMessageId: 173,
                            newsletterName: data.name,
                        },
                    },
                });
                await sock.sendMessage(m.cht, {
                    text: `• Successfully sent image with mimetype: *[ ${mime} ]*`,
                    edit: key
                }, {
                    quoted: m
                });
            } else if (mime.includes("video")) {
                await sock.sendMessage(data.id, {
                    video: await q.download(),
                    caption: caption || q.text,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: data.id,
                            serverMessageId: 173,
                            newsletterName: data.name,
                        },
                    },
                });
                await sock.sendMessage(m.cht, {
                    text: `• Successfully sent video with mimetype: *[ ${mime} ]*`,
                    edit: key
                }, {
                    quoted: m
                });
            } else {
                await sock.sendMessage(data.id, {
                    text: caption || q.text,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: data.id,
                            serverMessageId: 173,
                            newsletterName: data.name,
                        },
                    },
                });
                await sock.sendMessage(m.cht, {
                    text: `• Successfully sent text message : "${caption || q.text}"`,
                    edit: key
                }, {
                    quoted: m
                });
            }

        } catch (e) {
            throw `*[ ! ]* Failed to send media. Please try again. Error: ${e.message || e}`;
        }
    },
};