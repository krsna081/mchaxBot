// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
  command: "mediafire",
  alias: ["mf", "mfdl"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Unduh file dari MediaFire 🔽",
  loading: true,
  async run(m, { sock, Scraper, Func, text }) {
    if (!Func.isUrl(text) || !/mediafire.com/.test(text) || !text)
      throw "> *❌ Masukkan link MediaFire yang valid!*";
    let data = await Scraper.mediafire(text);    
    let cap = "*– 乂 MediaFire - Downloader 🗂️*\n";
    cap += `> *🔸 Nama File :* ${data.filename}\n`;
    cap += `> *🔸 Tipe File :* ${data.mimetype}\n`;
    cap += `> *🔸 Ukuran File :* ${data.size}\n`;
    cap += `> *🔸 Link Download :* ${data.download}\n`;

    let buffer = await fetch(data.download).then(async (a) =>
      Buffer.from(await a.arrayBuffer()),
    );
    let limit = Func.sizeLimit(data.size, db.list().settings.max_upload);

    if (limit.oversize)
      throw `Maaf, ukuran file *( ${data.size} )* melebihi batas ukuran yang ditentukan. Upgrade status kamu ke premium untuk mendownload file hingga *1GB*!`;

    m.reply({
      document: buffer,
      mimetype: data.mimetype,
      fileName: data.filename,
      caption: cap,
    });
  },
};
