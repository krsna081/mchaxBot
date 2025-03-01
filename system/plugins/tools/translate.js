const { translate } = require("@vitalets/google-translate-api");

module.exports = {
    command: "translate",
    alias: ["translate", "tr"],
    category: ["tools"],
    settings: { limit: false },
    description: "🌍 Menerjemahkan teks ke berbagai bahasa",
    loading: false,
    async run(m, { sock, Func, text }) {
        const args = text.trim().split(' ');
        if (args.length < 1) {
            throw "> ❌ *Harap masukkan kode bahasa target atau gunakan reply!*";
        }

        let target = args[0];
        let query = args.slice(1).join(' ');

        if (!query && m.quoted) {
            query = m.quoted.body;
        }

        if (!query) {
            let woi = await Func.fetchJson("https://translate.google.com/translate_a/l?client=webapp&sl=auto&tl=en&v=1.0&hl=en&pv=1&tk=&source=bh&ssel=0&tsel=0&kc=1&tk=626515.626515&q=");
            let data = woi.sl;
            let result = Object.entries(data).map(([code, name]) => `> [ ${code} ] ➝ ${name}`).join("\n");

            throw `> *– 乂 Panduan Penggunaan Perintah* 💡\n
            > Gunakan \`<kode_bahasa> <teks>\` atau reply pesan dengan \`<kode_bahasa>\`\n
            > *– 乂 Daftar Kode Bahasa yang Tersedia :*\n
            ${result}`;
        }

        try {
            let data = await require("@vitalets/google-translate-api").translate(query, { to: target, autoCorrect: true });

            let langFrom = data.raw?.src || "auto"
            let langTo = target;
            let translatedText = data.text.toString();

            let langList = await Func.fetchJson("https://translate.google.com/translate_a/l?client=webapp");
            let langFromName = langList.sl?.[langFrom] || "Tidak Diketahui";
            let langToName = langList.sl?.[langTo] || "Tidak Diketahui";

            let resultMessage = `– 乂 *Hasil Terjemahan*\n\n` +
                `> 📌 *Dari:* ${langFromName} [ ${langFrom} ]\n` +
                `> 🎯 *Ke:* ${langToName} [ ${langTo} ]\n\n` +
                `${translatedText}`;
            m.reply(resultMessage);
        } catch (error) {
            throw error;
        }
    },
};