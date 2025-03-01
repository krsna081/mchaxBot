module.exports = {
    command: "gc",
    alias: ["gc"],
    category: ["owner"],
    settings: {
        owner: true
    },
    description: "Mengelola grup auto buka/tutup",
    loading: false,
    async run(m, {
        sock,
        text
    }) {
        let dbGC = db.list().gcauto || {};

        if (!text) {
            let list = await Promise.all(Object.entries(dbGC).map(async ([id, {
                open,
                close
            }]) => {
                let metadata = await sock.groupMetadata(id).catch(() => null);
                let name = metadata ? metadata.subject : "Tidak ditemukan";
                return `> 📌 *${name}*\n  - 🆔 ID: ${id}\n  - 🕒 Open: ${open}\n  - 🔒 Close: ${close}`;
            }));

            return m.reply(`*– 乂 Penggunaan Group Settings*\n\n> ➕ *\`--add\`* Untuk menambah ID grup ke settings\n> ❌ *\`--delete\`* Untuk menghapus ID grup\n\n*– 乂 Daftar Grup yang Terdaftar*\n\n${list.length ? list.join("\n\n") : "Tidak ada grup yang terdaftar."}`);
        }

        if (text.includes("--add")) {
            let input = text.replace("--add", "").trim().split(" ");
            if (input.length !== 3) return m.reply("> ⚠️ Format salah! Gunakan:\n*gc --add id open close*");

            let [id, open, close] = input;
            if (!id.endsWith("@g.us")) return m.reply("> ⚠️ ID grup tidak valid!");
            if (!/^\d{2}:\d{2}$/.test(open) || !/^\d{2}:\d{2}$/.test(close))
                return m.reply("> ⚠️ Format waktu salah! Gunakan format `HH:mm` (misal: `05:00`).");

            let metadata = await sock.groupMetadata(id).catch(() => null);
            if (!metadata) return m.reply("> ⚠️ Grup tidak ditemukan atau bot bukan anggota grup tersebut!");
            let name = metadata.subject;
            dbGC[id] = {
                open,
                close
            };

            return m.reply(`> ✅ Grup *${name}* berhasil ditambahkan!\n\n🆔 ID: ${id}\n🕒 Open: ${open}\n🔒 Close: ${close}`);
        }

        if (text.includes("--delete")) {
            let id = text.replace("--delete", "").trim();
            if (!dbGC[id]) return m.reply("> ⚠️ Grup tidak ditemukan dalam daftar!");

            let metadata = await sock.groupMetadata(id).catch(() => null);
            let name = metadata ? metadata.subject : "Tidak ditemukan";
            delete dbGC[id];

            return m.reply(`> ❌ Grup *${name}* berhasil dihapus dari daftar!\n🆔 ID: ${id}`);
        }

        return m.reply("> ⚠️ Perintah tidak dikenali! Gunakan:\n*gc --add id open close*\n*gc --delete id*");
    },
};