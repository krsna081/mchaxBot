/** *Plugin Hytamkan Waifu*
   * @Author: Deku
   * @Api: https://api.hiuraa.my.id/
   * @Npm: @vioo/apis, path, file-type, fs
   * @Ch: https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
**/

const axios = require('axios');

let rin = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    text,
    config
}) => {
    const quoted = m.quoted ? m.quoted : m;
    if (!quoted || !quoted.msg.mimetype || !/image\/(jpeg|png)/.test(quoted.msg.mimetype)) {
        return m.reply('⚠️ Kirim/Reply Gambar Waifu Mu untuk diubah warna kulitnya!');
    }

    try {
        if (!text) {
            const media = await quoted.download();
            return sock.sendAliasMessage(m.cht, {
                image: media, caption: "Silahkan pilih warna kulit:\n\n" +
                    "> 1. Hitam\n" +
                    "> 2. Coklat\n" +
                    "> 3. Merah\n" +
                    "> 4. Biru Muda\n\n" +
                    "Balas dengan angka atau gunakan perintah:\n" +
                    `_${m.prefix + m.command} <warna>_`
            }, [
                { alias: "1", response: `${m.prefix + m.command} hitam` },
                { alias: "2", response: `${m.prefix + m.command} coklat` },
                { alias: "3", response: `${m.prefix + m.command} merah` },
                { alias: "4", response: `${m.prefix + m.command} biru muda` }
            ], m);
        }
        const meks = await quoted.download();
        const tmpfile = await Uploader.catbox(meks);
        let warna = text.toLowerCase();
        const pilihanWarna = ["hitam", "coklat", "merah", "biru muda"];
        if (!pilihanWarna.includes(warna)) {
            return m.reply("❌ Warna tidak valid! Gunakan: hitam, coklat, merah, atau birumuda.");
        }

        let api = await axios.post(`https://api.hiuraa.my.id/ai/gemini-canvas?text=Make+this+skin+${warna}&imageUrl=${tmpfile}`);

        if (!api.data.result || !api.data.result.image || !api.data.result.image.base64) {
            return m.reply("⚠️ Gagal mengubah warna kulit. Coba lagi nanti!");
        }

        const hytamkan = Buffer.from(api.data.result.image.base64, 'base64');
        await sock.sendMessage(m.cht, { image: hytamkan, caption: `✅ Warna kulit diubah menjadi *${warna}*` }, { quoted: m });

    } catch (e) {
        throw e;
    }
};

rin.command = "hitamkan";
rin.alias = ["hytamkan", "hytamkanwaifu"];
rin.category = ["tools"];
rin.settings = {
    limit: true
};
rin.loading = true;

module.exports = rin;