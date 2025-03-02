const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    command: "menu",
    alias: ["menu", "help"],
    category: ["main"],
    description: "Menampilkan menu bot",
    loading: true,
    async run(m, {
        sock,
        plugins,
        config,
        Func,
        text
    }) {
        let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
        let casePattern = /case\s+"([^"]+)"/g;
        let matches = data.match(casePattern);
        if (!matches) return m.reply("Tidak ada case yang ditemukan.");
        matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));

        let menu = {};
        plugins.forEach((item) => {
            if (Array.isArray(item.category) && item.command && item.alias) {
                item.category.forEach((cat) => {
                    if (!menu[cat]) {
                        menu[cat] = {
                            command: [],
                        };
                    }
                    menu[cat].command.push({
                        name: item.command,
                        alias: item.alias,
                        description: item.description,
                        settings: item.settings,
                    });
                });
            }
        });

        let cmd = 0;
        let alias = 0;
        let pp = await sock
            .profilePictureUrl(m.sender, "image")
            .catch((e) => "https://files.catbox.moe/8getyg.jpg");
        Object.values(menu).forEach((category) => {
            cmd += category.command.length;
            category.command.forEach((command) => {
                alias += command.alias.length;
            });
        });

        let premium = db.list().user[m.sender].premium.status;
        let limit = db.list().user[m.sender].limit;
        const now = moment().tz("Asia/Jakarta");
        const ramadhanDate = moment.tz("2025-03-01", "Asia/Jakarta");
        const idulFitriDate = moment.tz("2025-04-20", "Asia/Jakarta");
        const countdownRamadhan = ramadhanDate.diff(now, "days");
        const countdownIdulFitri = idulFitriDate.diff(now, "days");

        const header = `☘️ *N E K O – B O T*
👋 Hai nama saya NekoBot saya adalah asisten bot WhatsApp 
yang akan membantu anda dengan fitur yang sediakan !
─────────────────────────
📆 *Hitungan Mundur:*
> - 🕌 Ramadan: ${countdownRamadhan} hari lagi
> - 🎉 Idul Fitri: ${countdownIdulFitri} hari lagi
─────────────────────────
`;

        const footer = `
📢 *Jika Anda menemui masalah*
*hubungi developer bot.*
💻 *Script bot:* https://github.com/krsna081/mchaxBot
🤖 *Didukung oleh WhatsApp*
🌐 *Saluran WhatsApp NekoBot :*
https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J

> 💬 *Fitur Limit*: 🥈
> 💎 *Fitur Premium*: 🥇
─────────────────────────
`;

        if (text === "all") {
            let caption = `${header} 
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

  
🛠️ *Menu – Other* 
${matches.map((a, i) => `> *(${i + 1})* ${m.prefix + a}`).join("\n")}
─────────────────────────
`;

            Object.entries(menu).forEach(([tag, commands]) => {
                caption += `\n🛠️ *Menu – ${tag.toUpperCase()}* 
${commands.command.map((command, index) => `> *(${index + 1})* ${m.prefix + command.name} ${command.settings?.premium ? "🥇" : command.settings?.limit ? "🥈" : ""}`).join("\n")}
─────────────────────────
`;
            });

            caption += footer;

            m.reply({
                document: {
                    url: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J"
                },
                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                fileName: "「 K For Krisnoll 」",
                fileLength: 10,
                pageCount: 10,
                caption: caption,
                contextInfo: {
                    mentionedJid: sock.parseMention(caption),
                    externalAdReply: {
                        title: "© NekoBot | Playground",
                        body: "👨‍💻 Bot WhatsApp - Simple",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J",
                        thumbnailUrl: "https://files.catbox.moe/7365tv.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        } else if (text === "other") {
            let caption = `${header} 
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

  
🛠️ *Menu – Other* 
${matches.map((a, i) => `> *(${i + 1})* ${m.prefix + a}`).join("\n")}
─────────────────────────
`;

            caption += footer;

            m.reply({
                document: {
                    url: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J"
                },
                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                fileName: "「 K For Krisnoll 」",
                fileLength: 10,
                pageCount: 10,
                caption: caption,
                contextInfo: {
                    mentionedJid: sock.parseMention(caption),
                    externalAdReply: {
                        title: "© NekoBot | Playground",
                        body: "👨‍💻 Bot WhatsApp - Simple",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J",
                        thumbnailUrl: "https://files.catbox.moe/7365tv.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        } else if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
            let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
            let caption = `${header}
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

─────────────────────────
🛠️ *Menu – ${text.toUpperCase()}*
${list.command
  .map(
    (a, i) =>
      `> *(${i + 1})* ${m.prefix + a.name} ${a.settings?.premium ? "🥇" : a.settings?.limit ? "🥈" : ""}`,
  )
  .join("\n")}
─────────────────────────
`;

            caption += footer;

            m.reply({
                document: {
                    url: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J"
                },
                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                fileName: "「 K For Krisnoll 」",
                fileLength: 10,
                pageCount: 10,
                caption: caption,
                contextInfo: {
                    mentionedJid: sock.parseMention(caption),
                    externalAdReply: {
                        title: "© NekoBot | Playground",
                        body: "👨‍💻 Bot WhatsApp - Simple",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J",
                        thumbnailUrl: "https://files.catbox.moe/7365tv.jpg",
                        renderLargerThumbnail: true,
                    },
                },
            });
        } else {
            try {
                let list = Object.keys(menu);
                let caption = `${header}
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

─────────────────────────
`;

                caption += footer;
                let sections = [{
                    type: "list",
                    title: "Pilih Menu",
                    value: [{
                            headers: "– 乂 Menu Favorite",
                            rows: [{
                                    headers: `Menu All`,
                                    title: `- Melihat semua fitur yang tersedia`,
                                    command: `${m.prefix}menu all`
                                },
                                {
                                    headers: `Menu Other`,
                                    title: `- Melihat semua menu yang ada di case`,
                                    command: `${m.prefix}menu other`
                                },
                            ],
                        },
                        {
                            headers: "– 乂 Semua Plugins",
                            rows: list.map((a) => ({
                                headers: `Menu ${a.capitalize()}`,
                                title: `- Melihat menu ${a} yang tersedia`,
                                command: `${m.prefix}menu ${a}`,
                            })),
                        },
                    ],
                }, ]
                sock.sendButton(m.cht, sections, m, {
                    document: {
                        url: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J"
                    },
                    mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    fileName: "「 K For Krisnoll 」",
                    fileLength: 10,
                    pageCount: 10,
                    contextInfo: {
                        mentionedJid: [...sock.parseMention(caption)],
                        isForwarded: true,
                        externalAdReply: {
                            mediaType: 1,
                            title: "© NekoBot | Playground",
                            body: "👨‍💻 Bot WhatsApp - Simple",
                            thumbnailUrl: "https://files.catbox.moe/7365tv.jpg",
                            sourceUrl: "https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J",
                            renderLargerThumbnail: true,
                        },
                    },
                    caption,
                    footer: config.name,
                })
            } catch (e) {
                throw e;
            }
        }
    },
};