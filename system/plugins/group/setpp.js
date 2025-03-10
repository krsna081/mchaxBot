// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
  command: "setppgroup",
  alias: ["setppgc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "📸 Mengubah foto profil grup",
  async run(m, { sock }) {
    let q = m.quoted ? m.quoted : m;
    if (!q.isMedia)
      throw "⚠️ *Silakan kirim atau reply foto yang ingin dijadikan foto profil grup!*";

    let buffer = await q.download();
    await sock
      .updateProfilePicture(m.cht, buffer)
      .then(() => m.reply("> ✅ *Foto profil grup berhasil diperbarui!*"));
  },
};
