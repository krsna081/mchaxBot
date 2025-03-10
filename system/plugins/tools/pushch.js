// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const ya = require("js-beautify")
const {
    writeExif,
    videoToWebp
} = require(process.cwd() + "/lib/sticker");
const pkg = require(process.cwd() + "/package");
let yukio = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    let quoted = m.quoted ? m.quoted : m;
    let pp = await sock.profilePictureUrl(m.sender, 'image')

    let captions = quoted.text || "requires chat: ?"
    let saluran = await sock.newsletterMetadata("jid", config.id.newsletter);
    if (/audio/.test(quoted.msg.mimetype)) {
        await sock.sendMessage(config.id.newsletter, {
            audio: await quoted.download(),
            mimetype: 'audio/mpeg',
            ptt: true,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                externalAdReply: {
                    title: `> PushCh by: ${m.pushName}`,
                    body: `${pkg.name} || Version: ` + pkg.version,
                    mediaType: 1,
                    thumbnailUrl: pp,
                }
            }
        })
    } else if (/video/.test(quoted.msg.mimetype)) {
        await sock.sendMessage(config.id.newsletter, {
            video: await quoted.download(),
            caption: captions,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
            }
        })
    } else if (/image/.test(quoted.msg.mimetype)) {
        await sock.sendMessage(config.id.newsletter, {
            image: await quoted.download(),
            caption: captions,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                externalAdReply: {
                    title: `PushCh by: ${m.pushName}`,
                    body: `${pkg.name} || Version: ` + pkg.version,
                    mediaType: 1,
                    thumbnailUrl: pp,
                }
            }
        })
    } else if (/sticker/.test(quoted.msg.mimetype)) {
        let stickerte = await writeExif({
            mimetype: await q.msg.mimetype,
            data: await quoted.download(),
        }, {
            packName: config.sticker.packname,
            packPublish: config.sticker.author,
        }, );
        await sock.sendMessage(config.id.newsletter, {
            sticker: stickerte,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                externalAdReply: {
                    title: `PushCh by: ${m.pushName}`,
                    body: `${pkg.name} || Version: ` + pkg.version,
                    mediaType: 1,
                    thumbnailUrl: pp,
                }
            }
        })
    } else if (captions) {
        await sock.sendMessage(config.id.newsletter, {
            text: captions,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                externalAdReply: {
                    title: `PushCh by: ${m.pushName}`,
                    body: `${pkg.name} || Version: ` + pkg.version,
                    mediaType: 1,
                    thumbnailUrl: pp,
                }
            }
        })
    } else m.reply('maaf anda bisa kirim audio, video, image, teks aja yg lain gabisa😂')
}

yukio.command = "pushch"
yukio.alias = ["pshch", "psch"]
yukio.category = ["tools"]

yukio.settings = {
    owner: true
}
yukio.loading = true

module.exports = yukio