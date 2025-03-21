// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const config = require("../settings.js");
const Func = require("../lib/function.js");
const Uploader = require("../lib/uploader.js");
const chalk = require("chalk");

module.exports = async (m, sock, store) => {
    const mchax = sock;
    try {
        require("../lib/system.js")(m, sock, store);
    } catch (e) {
        console.log(e);
    };

    await db.main(m);
    if (m.isBot) return;
    if (db.list().settings.online) sock.readMessages([m.key]);
    if (db.list().settings.self && !m.isOwner) return;
    if (m.isGroup && db.list().group[m.cht]?.mute && !m.isOwner) return;

    if (m.isGroup) {
        db.list().group[m.cht].totalpesan[m.sender] = db.list().group[m.cht].totalpesan[m.sender] || {
            member: m.sender,
            chat: 0
        };
        db.list().group[m.cht].totalpesan[m.sender].chat += 1;
    }

    if (m.isOwner) {
        db.list().user[m.sender].premium = {
            status: true,
            expired: 99999
        };
        db.list().user[m.sender].limit = 99999;
    }

    if (Object.keys(store.groupMetadata).length === 0) {
        store.groupMetadata = await sock.groupFetchAllParticipating();
    }

    const isPrems = db.list().user[m.sender].premium.status;
    const isBanned = db.list().user[m.sender].banned.status;
    const isAdmin = m.isAdmin;
    const botAdmin = m.isBotAdmin;
    const Scraper = await scraper.list();
    const usedPrefix = config.prefix.includes(m.prefix);
    const text = m.text;
    const isCmd = m.prefix && usedPrefix;

    if (isPrems) {
        db.list().user[m.sender].limit = 99999;
    }

    if (isCmd) {
        db.list().user[m.sender].rpg.exp += Math.floor(Math.random() * 20) + 1;
    }

    if (db.list().settings.private && isCmd && !m.fromMe && !m.isOwner && !isPrems && !m.isGroup) {
        await m.reply(`Kami mohon maaf, tetapi bot saat ini hanya dapat diakses dalam grup. Jika Anda ingin menggunakan bot secara pribadi, silakan tingkatkan status Anda. Jika Anda tertarik, silakan hubungi pemilik kami di bawah ini:\n\n${config.owner.map((a, i) => `> - *Contact ${i + 1} :* wa.me/` + a).join("\n")}`);
        return;
    }

    if (isCmd && !(await sock.groupMetadata(config.id.group)).participants.map(a => a.id).includes(m.sender) && !isPrems && !m.isOwner) {
        let cap = `Sebelum mengakses fitur [ ${m.prefix + m.command} ], silahkan bergabung dengan komunitas MchaX-Bot untuk mendapatkan akses penuh ke bot ini dan fitur-fitur lainnya.\n\n*– Bergabung Sekarang:*\nhttps://chat.whatsapp.com/Kk4OfajNSAQB6Oq3LrKF41`
        sock.sendMessage(
            m.cht, {
                text: cap,
                contextInfo: {
                    externalAdReply: {
                        title: await (await sock.groupMetadata(config.id.group)).subject,
                        sourceUrl: "https://chat.whatsapp.com/Kk4OfajNSAQB6Oq3LrKF41",
                        thumbnailUrl: await sock.profilePictureUrl(config.id.group, 'image').catch(_ => null),
                        mediaType: 1,
                        renderLargerThumbnail: false,
                    },
                },
            }, {
                quoted: m
            },
        );
        return
    }

    if (isCmd) {
        require("./case.js")(m,
            sock,
            mchax,
            config,
            text,
            Func,
            Scraper,
            Uploader,
            store,
            isAdmin,
            botAdmin,
            isPrems,
            isBanned,
        );
    }

    for (let name in pg.plugins) {
        let plugin;
        if (typeof pg.plugins[name].run === "function") {
            let anu = pg.plugins[name];
            plugin = anu.run;
            for (let prop in anu) {
                if (prop !== "code") {
                    plugin[prop] = anu[prop];
                }
            }
        } else {
            plugin = pg.plugins[name];
        }
        if (!plugin) return;

        try {
            if (typeof plugin.events === "function") {
                if (
                    plugin.events.call(sock, m, {
                        sock,
                        mchax,
                        Func,
                        config,
                        Uploader,
                        store,
                        isAdmin,
                        botAdmin,
                        isPrems,
                        isBanned,
                    })
                )
                    continue;
            }

            const cmd = usedPrefix ?
                m.command.toLowerCase() === plugin.command ||
                plugin?.alias?.includes(m.command.toLowerCase()) :
                "";
            if (cmd) {
                if (plugin.loading) {
                    m.react("🕐");
                }
                if (plugin.settings) {
                    if (plugin.settings.owner && !m.isOwner) {
                        return m.reply(config.messages.owner);
                    }
                    if (plugin.settings.premium && !isPrems) {
                        return m.reply(config.messages.premium);
                    }
                    if (plugin.settings.group && !m.isGroup) {
                        return m.reply(config.messages.group);
                    }
                    if (plugin.settings.private && m.isGroup) {
                        return m.reply(config.messages.private);
                    }
                    if (plugin.settings.admin && !isAdmin) {
                        return m.reply(config.messages.admin);
                    }
                    if (plugin.settings.botAdmin && !botAdmin) {
                        return m.reply(config.messages.botAdmin);
                    }
                }

                await plugin(m, {
                        sock,
                        mchax,
                        config,
                        text,
                        plugins: Object.values(pg.plugins).filter((a) => a.alias),
                        Func,
                        Scraper,
                        Uploader,
                        store,
                        isAdmin,
                        botAdmin,
                        isPrems,
                        isBanned,
                    })
                    .then(async (a) => {
                        if (plugin?.settings?.limit && !isPrems && !m.isOwner) {
                            let user = db.list().user[m.sender];
                            if (user.limit > plugin.settings.limit) {
                                user.limit -= plugin.settings.limit;
                                m.reply(
                                    `> 💡 *Informasi:* Kamu telah menggunakan fitur limit\n> *- Limit kamu saat ini:* ${user.limit} tersisa ☘️\n> *- Catatan:* Limit akan direset pada pukul 02:00 WIB setiap harinya.`
                                );
                                if (user.limit === plugin.settings.limit) {
                                    m.reply(
                                        `⚠️ *Peringatan:* Limit kamu sudah habis! ❌\nSilakan tunggu hingga reset pukul 02:00 WIB atau beli limit tambahan.`
                                    );
                                }
                            } else {
                                m.reply(
                                    `⚠️ *Peringatan:* Limit kamu sudah habis! ❌\nSilakan tunggu hingga reset pukul 02:00 WIB atau beli limit tambahan.`
                                );
                            }
                        }
                    })
            }
        } catch (error) {
            if (error.name) {
                for (let owner of config.owner) {
                    let jid = await sock.onWhatsApp(owner + "@s.whatsapp.net");
                    if (!jid[0].exists) continue;
                    let caption = "*– 乂 *Error Terdeteksi* 📉*\n"
                    caption += `> *Nama command:* ${m.command}\n`
                    caption += `> *Lokasi File:* ${name}`
                    caption += `\n\n${Func.jsonFormat(error)}`

                    sock.sendMessage(owner + "@s.whatsapp.net", {
                        text: caption
                    })
                }
                m.reply("*– 乂 *Error Terdeteksi* 📉*\n !*\n> Command gagal dijalankan karena terjadi error\n> Laporan telah terkirim kepada owner kami dan akan segera di perbaiki !");
            } else {
                m.reply(Func.jsonFormat(error));
            }
        }
    }
};