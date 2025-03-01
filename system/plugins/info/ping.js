const os = require("node:os");
const fs = require("node:fs");
const baileys = require("baileys");

module.exports = {
    command: "ping",
    alias: ["ping", "p"],
    category: ["main"],
    description: "Periksa Status bot",
    loading: true,
    async run(m, {
        sock,
        config,
        Func
    }) {
        let start = performance.now(),
            node = process.memoryUsage(),
            info = await fetch("https://ipwho.is").then((a) => a.json()),
            cap = `╭──[ *Informasi Bot* ]
᎒⊸ 🖥️ *Berjalan Di* : ${process.env.USER === "root" ? "VPS" : process.env.USER === "container" ? "HOSTING ( PANEL )" : process.env.USER}
᎒⊸ ⏱️ *Uptime* : ${Func.toDate(process.uptime() * 1000)}
᎒⊸ 🏠 *Direktori Rumah* : ${os.homedir}
᎒⊸ 📂 *Direktori Tmp* : ${os.tmpdir()} *( ${fs.readdirSync(process.cwd() + os.tmpdir).length} Berkas )*
᎒⊸ 🖥️ *Hostname* : ${os.hostname()}
᎒⊸ ⚙️ *Versi Node* : ${process.version}
᎒⊸ 🌍 *Cwd* : ${process.cwd()}
╰────────────•

╭──[ *Informasi Provider* ]
᎒⊸ 🌐 *ISP* : ${info.connection.isp}
᎒⊸ 🏢 *Organisasi* : ${info.connection.org}
᎒⊸ 🌎 *Negara* : ${info.country}
᎒⊸ 🏙️ *Kota* : ${info.city}
᎒⊸ 🚩 *Bendera* : ${info.flag.emoji}
᎒⊸ ⏰ *Zona Waktu* : ${info.timezone.id}
╰────────────•

╭──[ *Informasi Server Asal* ]
᎒⊸ 🚀 *Kecepatan* : ${(performance.now() - start).toFixed(3)} ms
᎒⊸ ⏳ *Uptime* : ${Func.toDate(os.uptime() * 1000)}
᎒⊸ 🧠 *Total Memori* : ${Func.formatSize(os.totalmem() - os.freemem())} / ${Func.formatSize(os.totalmem())}
᎒⊸ 🖥️ *CPU* : ${os.cpus()[0].model} ( ${os.cpus().length} CORE )
᎒⊸ 📦 *Rilis* : ${os.release()}
᎒⊸ 🖧 *Tipe* : ${os.type()}
╰────────────•

╭──[ *Penggunaan Memori Nodejs* ]
${Object.entries(node)
  .map(([a, b]) => `᎒⊸ 💾 *${a.capitalize()}* : ${Func.formatSize(b)}`)
  .join("\n")}
╰────────────•`;

        await sock.relayMessage(m.cht, {
            groupInviteMessage: {
                groupJid: config.id.group,
                inviteCode: "JU36ze/gq5VH4UTR",
                inviteExpiration: 00007,
                groupName: `*– 乂 Kecepatan Respon*`,
                jpegThumbnailUrl: null,
                caption: cap,
            }
        }, {
            userJid: sock.user.id,
            quoted: m
        }, {
            messageId: m.key.id
        })
    },
};