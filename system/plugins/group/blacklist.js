module.exports = {
    command: "blacklist",
    alias: ["bl"],
    category: "group",
    settings: { admin: true, group: true, botAdmin: true },
    description: "Blacklist user dari grup",
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
        let chatId = m.cht;
        let action = m.args[0]?.toLowerCase();
        let who = m.quoted 
            ? m.quoted.sender 
            : m.mentions.length > 0 
                ? m.mentions[0] 
                : m.args[1] || false;
        let dbGroup = db.list().group[chatId];

        if (!text) {
            let list = dbGroup.blacklist;
            if (list.length === 0) return m.reply("*✅ Tidak ada pengguna yang di-blacklist dalam grup ini!*");
            
            let txt = "*– 乂 Daftar User Ter-Blacklist –*\n\n";
            txt += list.map((u, i) => `*${i + 1}.* @${u.split("@")[0]}`).join("\n");
            txt += `\n\n📌 Gunakan *--add* @user untuk menambah.\n📌 Gunakan *--delete* @user untuk menghapus.`;
            return m.reply(txt, { mentions: list });
        }

        if (!["--add", "--delete"].includes(action)) {
            return m.reply(`*⚠️ Format Salah!*\n\nGunakan salah satu perintah berikut:\n📌 *--add* @user ➜ Tambahkan blacklist\n📌 *--delete* @user ➜ Hapus dari blacklist`);
        }

        if (!who) {
            return m.reply(`*⚠️ Perintah Tidak Lengkap!*\n\nGunakan salah satu cara berikut:\n📌 *--add* @user ➜ Tambahkan blacklist\n📌 *--delete* @user ➜ Hapus dari blacklist`);
        }

        let user = await sock.onWhatsApp(who);
        if (!user[0]?.exists) {
            return m.reply(`*❌ Anggota Tidak Ditemukan!*\n\n> Akun WhatsApp ini tidak terdaftar atau sudah tidak aktif.`);
        }

        if (action === "--add") {
            if (dbGroup.blacklist.includes(who)) {
                return m.reply("⚠️ Pengguna sudah ada dalam daftar blacklist!");
            }
            dbGroup.blacklist.push(who);
            return m.reply(`✅ Pengguna @${who.split("@")[0]} telah ditambahkan ke blacklist grup ini.`, null, {
                mentions: [who]
            });
        }

        if (action === "--delete") {
            if (!dbGroup.blacklist.includes(who)) {
                return m.reply("⚠️ Pengguna tidak ada dalam daftar blacklist!");
            }
            dbGroup.blacklist = dbGroup.blacklist.filter(u => u !== who);
            return m.reply(`✅ Pengguna @${who.split("@")[0]} telah dihapus dari blacklist grup ini.`, null, {
                mentions: [who]
            });
        }
    }
};