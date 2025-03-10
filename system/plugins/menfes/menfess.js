module.exports = {
    command: "menfess",
    alias: ["confes", "menfes", "confess"],
    category: ["menfess"],
    settings: {},
    description: "Mengirimkan Pesan Menfess",
    async run(m, {
        sock,
        text,
        Func
    }) {
        switch (m.command) {
            case "menfess":
            case "confes":
            case "menfes":
            case "confess": {
                sock.menfes = sock.menfes ?? {};
                const roof = Object.values(sock.menfes).find(menpes => [menpes.a, menpes.b].includes(m.sender));
                if (roof) return m.reply("Kamu masih berada dalam sesi menfess");
                if (m.isGroup) return m.reply("Fitur hanya tersedia di private chat!");
                if (!text) return m.reply(`Kirim perintah ${m.prefix + m.command} nama|nomor|pesan\n\nContoh:\n${m.prefix + m.command} ${m.pushName}|628xxx|Menfess nih`);
                if (!text.includes('|')) return m.reply("Format salah! Gunakan format: nama|nomor|pesan");

                let [namaNya, nomorNya, pesanNya] = text.split('|');
                nomorNya = nomorNya.replace(/^0/, '62');
                if (isNaN(nomorNya)) return m.reply("Nomor tidak valid! Pastikan hanya menggunakan angka.");

                const yoi = `Hi ada menfess nih buat kamu\n\nDari: ${namaNya}\nPesan: ${pesanNya}\n\nKetik:\n${m.prefix}balasmenfess -- Untuk menerima menfess\n${m.prefix}tolakmenfess -- Untuk menolak menfess\n\n_Pesan ini dikirim oleh bot._`;
                const tod = await Func.fetchBuffer('https://telegra.ph/file/c8fdfc8426f5f60b48cca.jpg');

                const id = m.sender;
                sock.menfes[id] = {
                    id,
                    a: m.sender,
                    b: `${nomorNya}@s.whatsapp.net`,
                    state: 'WAITING',
                };

                await sock.sendMessage(`${nomorNya}@s.whatsapp.net`, {
                    image: tod,
                    caption: yoi
                });
                m.reply("Pesan berhasil dikirim ke nomor tujuan. Semoga dibalas ya!");
            }
            break
        }
    }
}