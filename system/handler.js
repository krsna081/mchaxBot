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

    if (db.list().settings.private && cmd && !m.fromMe && !m.isOwner && !isPrems && !m.isGroup) {
    let caption = `*– Bot tidak dapat diakses di private chat*\n
> Maaf Hanya pengguna premium saja yang dapat mengakses fitur di Private bot jika kamu melihat pesan ini berarti kamu hanya pengguna gratis\n
> Tapi tenang kamu masih bisa akses bot ini di Komunitas MchaX-Bot\n
> Kamu dapat akses fitur downloader, game, play, ai, dan lain lain sekarang jika bergabung 

*– Bergabung sekarang :*
https://chat.whatsapp.com/${(await sock.groupInviteCode(config.id.group))}

*– Jika anda ingin membeli premium kontak owner :*
${config.owner.map((a, i) => `*• Kontak ${i + 1} :* wa.me/` + a).join("\n")}
`;
    await m.reply(caption);
        return;
    }

    if (cmd && !(await sock.groupMetadata(config.id.group)).participants.map(a => a.id).includes(m.sender) &&  !isPrems && !m.isOwner) {
    let caption = `*– Sepertnya Kamu belum menjadi member*\n
Sebelum mengakses fitur *[ ${m.command} ]* Silahkan bergabung ke komunitas MchaX-Bot agar dapat mengakses bot ini lebih lanjut 

Setelah bergabung kamu dapat akses fitur bot ini kembali

*– Bergabung Sekarang :*
https://chat.whatsapp.com/${(await sock.groupInviteCode(config.id.group))}`;
    await m.reply(caption);
        return
    }
                    
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