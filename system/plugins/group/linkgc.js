// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
  command: "link",
  alias: ["linkgc"],
  category: ["group"],
  settings: {
    group: true,
    botAdmin: true,
  },
  description: "🔗 Mendapatkan tautan undangan grup",
  async run(m, { sock }) {
    try {
      let link =
        "https://chat.whatsapp.com/" + (await sock.groupInviteCode(m.cht));
      let caption = `*– 乂 Informasi Tautan Grup*\n\n`;
      caption += `> *- Nama Grup :* ${m.metadata.subject}\n`;
      caption += `> *- Tautan :* ${link}\n\n`;
      caption += `📌 _Gunakan tautan ini dengan bijak untuk menjaga keamanan grup._`;

      m.reply(caption);
    } catch (error) {
      m.reply(
        `*❌ Gagal Mendapatkan Link!*\n\n> Pastikan bot memiliki hak admin untuk membuat tautan grup.`,
      );
    }
  },
};
