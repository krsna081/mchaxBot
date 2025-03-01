module.exports = {
  command: "randomkick",
  alias: ["rkick", "tendangacak"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "🔴 Mengeluarkan anggota grup secara acak",
  async run(m, { sock }) {
    try {
      let groupMetadata = await sock.groupMetadata(m.cht);
      let participants = groupMetadata.participants
        .filter((p) => !p.admin)
        .map((p) => p.id);

      if (participants.length === 0) {
        throw `⚠️ Tidak ada anggota biasa di grup ini untuk dikeluarkan!`;
      }

      let who = participants[Math.floor(Math.random() * participants.length)];

      await sock.groupParticipantsUpdate(m.cht, [who], "remove");
      m.reply(
        `*✅ Random Kick! 🥾*\n\n> @${who.split("@")[0]} telah dikeluarkan secara acak dari grup.\n\n📌 _Jangan baper ya!_ 😆`,
        { mentions: [who] }
      );
    } catch (err) {
      console.error(err);
      m.reply(`❌ *Gagal Random Kick!*\n\n> ${err.message}`);
    }
  },
};