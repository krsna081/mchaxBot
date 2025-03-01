const axios = require("axios");

class Command {
    constructor() {
        this.command = ["nhentai"];
        this.alias = ["nht"];
        this.category = ["anime"];
        this.settings = {};
        this.description = "Menampilkan daftar atau detail doujin dari nhentai";
        this.loading = true;
    }

    run = async (m, { sock, Scraper, text }) => {
        try {
            if (text) {
                if (/nhentai\.net\/g\/\d+/.test(text)) {
                    let result = await Scraper.hentai.detail(text);
                    if (!result) return m.reply("*Hentai tidak ditemukan!*");

                    // Konversi gambar ke PDF
                    let pdfBuffer = await toPDF(result.images);
                    await sock.sendMessage(m.cht, {
                        document: pdfBuffer,
                        mimetype: "application/pdf",
                        fileName: `${result.title}.pdf`,
                        caption: `*Title:* ${result.title}\n*Uploaded:* ${result.uploaded}\n\nGunakan link berikut untuk membaca lebih lanjut:\n${text}`
                    }, { quoted: m });
                } else {
                    m.reply("*Link tidak valid!* Pastikan menggunakan format `nhentai.net/g/xxxxxx`.");
                }
            } else {
                let latest = await Scraper.hentai.latest();
                if (!latest.length) return m.reply("*Tidak ada data tersedia!*");

                let caption = `*– 乂 Latest Hentai*\n\n`;

                for (let doujin of latest) {
                    caption += `🔹 *${doujin.title}*\n🔗 ${doujin.url}\n\n`;
                }
                await sock.sendMessage(m.cht, { image: { url: latest[0].thumb }, caption }, { quoted: m });
            }
        } catch (e) {
            console.error(e);
            m.reply("*Terjadi kesalahan!* Coba lagi nanti.");
        }
    };
}

module.exports = new Command();

const PDFDocument = require("pdfkit");
async function toPDF(images, opt = {}) {
    return new Promise(async (resolve, reject) => {
        if (!Array.isArray(images)) images = [images];
        let buffs = [], doc = new PDFDocument({ margin: 0, size: 'A4' });
        for (let x = 0; x < images.length; x++) {
            if (/.webp|.gif/.test(images[x])) continue;
            let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data;
            doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
            if (images.length != x + 1) doc.addPage();
        }
        doc.on('data', (chunk) => buffs.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffs)));
        doc.on('error', (err) => reject(err));
        doc.end();
    });
}