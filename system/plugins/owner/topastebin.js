// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require('axios');

module.exports = {
    command: "topastebin",
    alias: ["topaste", "topastebin"],
    category: ["owner"],
    settings: { owner: true },
    description: "Mengupload konten ke pastebin.com",
    loading: false,
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
        try {
            if (!text) return m.reply(`❗ Harap masukkan title dan content yang mau di-upload.\n\n> *Contoh:* \n${m.prefix + m.command} case geser bumi|case "geserbumi":\ntry {\n   m.reply("Sukses geser bumi!")\n} catch (e) {\n   m.reply("Error bumi gamau")\n}\nbreak;`);

            let [title, ...contextArr] = text.split("|").map(t => t.trim());
            let context = contextArr.join("|");

            if (!title || !context) return m.reply("❗ Harap masukkan title dan content dengan format yang benar.");

            let pasteResult = await createPaste(title, context);
            if (!pasteResult.original) return m.reply("❗ Gagal mengunggah ke Pastebin.");

            m.reply(`*– 乂 Upload Pastebin*\n> *- Original :* ${pasteResult.original}\n> *- Raw URL :* ${pasteResult.raw}`);
        } catch (e) {
            console.error(e);
            m.reply("❗ Terjadi kesalahan saat mengupload ke Pastebin.");
        }
    },
};

async function createPaste(title, content) {
    const data = new URLSearchParams({
        api_dev_key: 'gSg_ugfku9g4dhXRWi6WCLPe05f074Iy',
        api_user_key: 'feec1b2a9385dc51b098bf220162b317',
        api_paste_name: title,
        api_paste_code: content,
        api_paste_private: '0',
        api_paste_format: 'text',
        api_paste_expire_date: 'N',
        api_option: 'paste',
    });

    try {
        const response = await axios.post('https://pastebin.com/api/api_post.php', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const result = response.data;

        if (result.startsWith("http")) {
            const rawUrl = result.replace("pastebin.com/", "pastebin.com/raw/");
            return { status: 0, original: result, raw: rawUrl };
        } else {
            console.error("Pastebin Error:", result);
            return { status: 1, original: null, raw: null };
        }
    } catch (error) {
        console.error("Error:", error.message);
        return { status: 1, original: null, raw: null };
    }
}