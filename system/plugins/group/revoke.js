// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
  command: "resetlink",
  alias: ["revoke"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "🔗 Mereset ulang link undangan grup",
  async run(m, { sock }) {
    try {
      const newLink = await sock.groupRevokeInvite(m.cht);
      m.reply(
        `*✅ Link Grup Berhasil Direset!*\n\n> 🔗 *Link Baru:* https://chat.whatsapp.com/${newLink}\n\n📌 _Silakan bagikan link ini kepada anggota baru._`,
      );
    } catch (err) {
      m.reply(
        `*❌ Gagal Mereset Link!*\n\n> Pastikan bot memiliki hak admin untuk melakukan perubahan ini.`,
      );
    }
  },
};
