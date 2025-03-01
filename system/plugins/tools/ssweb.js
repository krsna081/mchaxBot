module.exports = {
    command: "ssweb",
    alias: ["ssweb", "sshp", "sspc", "sstablet"],
    settings: { limit: true },
    description: "Screenshot Website",
    async run(m, { sock, text }) {
        if (!text) return m.reply(`❗ Harap masukkan URL.\n\n> *Contoh:* ${m.prefix + m.command} https://github.com/krsna081`);
        if (!text.startsWith('http')) return m.reply("❌ URL tidak valid. Pastikan menggunakan format lengkap (http/https).");

        let isFullPage = text.includes("--full");
        let url = text.replace("--full", "").trim();
        
        let width, crop;
        switch (m.command) {
            case "ssweb":
                width = 1900; crop = 1000; break;
            case "sshp":
                width = 720; crop = 1280; break;
            case "sspc":
                width = 1366; crop = 768; break;
            case "sstablet":
                width = 800; crop = 1280; break;
        }

        let buf = `https://image.thum.io/get/width/${width}/crop/${crop}/${isFullPage ? "fullpage/" : ""}${url}`;

        await sock.sendMessage(m.cht, {
            image: { url: buf },
            caption: `*– 乂 Screenshot Web*\n> - *Request :* ${url}`
        }, { quoted: m });
    }
};