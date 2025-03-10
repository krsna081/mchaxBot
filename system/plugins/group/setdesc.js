// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
  command: "setdeskripsi",
  alias: ["setdesc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "📝 Mengganti deskripsi grup dengan teks baru",
  async run(m, { sock, text }) {
    if (!text)
      throw "⚠️ *Silakan masukkan deskripsi grup baru!*\n\n💡 Contoh: setdesc Grup Diskusi Seru.";
    if (text.length > 200)
      throw "❌ *Deskripsi terlalu panjang!*\nMaksimal 200 karakter.";

    await sock.groupUpdateDescription(m.cht, text.trim());
    m.reply(
      `✅ *Deskripsi Grup Berhasil Diperbarui!*\n\n📝 *Deskripsi Baru:*\n${text.trim()}`,
    );
  },
};
