// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    getBinaryNodeChild,
    getBinaryNodeChildren,
    generateWAMessageFromContent,
    proto
} = require('baileys');
const fetch = require('node-fetch');

module.exports = {
    command: "add",
    alias: [],
    category: ["group"],
    settings: {
        group: true,
        admin: true,
        botAdmin: true,
    },
    description: "Menambahkan anggota ke grup",
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        if (!text && !m.quoted) return m.reply(`❗ *Format Salah*\nKirim perintah ini dengan format:\n> Ketik nomor pengguna yang ingin ditambahkan\n> Atau reply pesan pengguna dengan perintah ini.`);

        let link = await sock.groupInviteCode(m.cht).catch(() => null);
        if (!link) return m.reply("⚠️ Error: Tidak bisa mendapatkan kode undangan grup.");

        let metadata = await sock.groupMetadata(m.cht).catch(() => null);
        if (!metadata) return m.reply("⚠️ Error: Gagal mendapatkan informasi grup.");
        let groupName = metadata.subject;

        let existingParticipants = metadata.participants.map(user => user.id);
        let inputNumbers = [];

        if (m.quoted) {
            inputNumbers.push(m.quoted.sender.split('@')[0]);
        }

        if (text) {
            inputNumbers = inputNumbers.concat(
                text.split(',')
                .map(v => v.replace(/[^0-9]/g, ''))
                .filter(v => v.length > 4 && v.length < 20)
            );
        }

        inputNumbers = [...new Set(inputNumbers)];

        for (const number of inputNumbers) {
            const jid = number + '@s.whatsapp.net';

            if (existingParticipants.includes(jid)) {
                await m.reply(`⚠️ Pengguna tersebut sudah menjadi anggota grup ini @${number}`);
                continue;
            }

            const exists = await sock.onWhatsApp(jid);
            if (!exists[0]?.exists) {
                await m.reply(`⚠️ Pengguna @${number} tidak terdaftar di WhatsApp`);
                continue;
            }

            try {
                const response = await sock.query({
                    tag: 'iq',
                    attrs: {
                        type: 'set',
                        xmlns: 'w:g2',
                        to: m.cht,
                    },
                    content: [{
                        tag: 'add',
                        attrs: {},
                        content: [{
                            tag: 'participant',
                            attrs: {
                                jid
                            },
                        }],
                    }],
                });

                const participant = getBinaryNodeChildren(response, 'add');
                const user = participant[0]?.content.find(item => item.attrs.jid === jid);

                if (user?.attrs.error === '421') {
                    m.reply(
                        "⚠️ Tidak dapat menambahkan pengguna tersebut. Mereka telah membatasi undangan ke grup.",
                    );
                }
                if (user?.attrs.error === '408') {
                    await m.reply(`✅ Undangan grup berhasil dikirim ke @${number} karena pengguna baru saja keluar dari grup.`);
                    await sock.sendMessage(
                        jid, {
                            text: '✨ Anda diundang kembali ke grup ini:\nhttps://chat.whatsapp.com/' + link,
                            contextInfo: {
                                externalAdReply: {
                                    title: groupName,
                                    body: null,
                                    thumbnailUrl: await sock.profilePictureUrl(m.cht, 'image').catch(_ => null),
                                    sourceUrl: 'https://chat.whatsapp.com/' + link,
                                    mediaType: 1,
                                    renderLargerThumbnail: false,
                                },
                            },
                        }, {
                            quoted: null
                        },
                    );
                    continue;
                }
                if (user?.attrs.error === '403') {
                    await m.reply(`✅ Undangan grup berhasil dikirim ke @${number}.`);
                    const content = getBinaryNodeChild(user, 'add_request');
                    const {
                        code,
                        expiration
                    } = content.attrs;
                    const pp = await sock.profilePictureUrl(m.cht, 'image').catch(_ => null);
                    const jpegThumbnail = pp ? await Func.fetchBuffer(pp) : Buffer.alloc(0);

                    const msgs = generateWAMessageFromContent(
                        m.cht,
                        proto.Message.fromObject({
                            groupInviteMessage: {
                                groupJid: m.cht,
                                inviteCode: code,
                                inviteExpiration: parseInt(expiration),
                                groupName: groupName,
                                jpegThumbnail: jpegThumbnail,
                                caption: `🌟 Hai @${number}!\nAnda telah diundang oleh salah satu admin grup *${groupName}*. Klik tombol di bawah untuk bergabung kembali!`,
                            },
                        }), {
                            userJid: sock.user.id,
                        }
                    );

                    await sock.sendMessage(jid, {
                        forward: msgs,
                        mentions: [number]
                    });
                }
            } catch (err) {
                console.error(err);
                await m.reply(`Error occurred while adding @${number}: ${err.message}`);
            }
        }
    },
};