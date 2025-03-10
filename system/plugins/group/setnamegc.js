// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
  command: "setnamegroup",
  alias: ["setnamegc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "📝 Mengubah nama grup ke nama yang baru",
  async run(m, { sock, text }) {
    if (!text)
      throw "⚠️ *Silakan masukkan nama grup baru!*\n\n💡 Contoh: setnamegc Grup Santai.";
    if (text.length > 20)
      throw "❌ *Nama grup terlalu panjang!*\nMaksimal 20 karakter.";

    await sock.groupUpdateSubject(m.cht, text.trim());
    m.reply(
      `✅ *Nama grup berhasil diubah!* \n\n📝 *Nama Grup Baru:*\n${text.trim()}`,
    );
  },
};
