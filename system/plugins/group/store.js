const fs = require("fs");

module.exports = {
  command: "store",
  alias: [""],
  category: ["group"],
  settings: {
    admin: true,
    group: true,
  },
  description: "Pengelolaan dan Pengaturan Store Bot dengan Mudah",
  async run(m, { text, sock, store }) {
    let msgs = db.list().group[m.cht].store || {};
    let keys = Object.keys(msgs);
    
    if (!text) throw `> *– 乂 Panduan Penggunaan Perintah* 💡\n
            > 1. Gunakan *\`--add\`* untuk menambahkan pesan\n
            > 2. Gunakan *\`--delete\`* untuk menghapus pesan\n
            > 3. Gunakan *\`--list\`* untuk melihat daftar pesan\n\n            
            > *– 乂 Daftar Pesan yang Tersedia :*\n
            ${keys.map((a, i) => `> *${i + 1}.* ${a}`).join("\n") || "Tidak ada pesan yang tersimpan."}`;

    // --add
    if (text.includes("--add")) {
      if (!m.quoted) throw `> *– 乂 Mohon balas pesan yang ingin kamu simpan.*\n
                > Harap pastikan bahwa pesan yang kamu kirim valid dan lengkap!`;
      
      let input = text.replace("--add", "").trim();
      if (!input) throw `> Masukkan nama pesan yang ingin kamu tambahkan.`;
      if (input in msgs) throw `> Pesan ${input} sudah ada`;

      msgs[input] = {
        key: m.quoted.key,
        message: m.quoted.message,
        sender: m.sender
    };

    // --delete
    else if (text.includes("--delete")) {
      let input = text.replace("--delete", "").trim();
      if (!input) throw `> Silakan masukkan nama atau nomor pesan yang ingin kamu hapus.`;

      let target = isNaN(input) ? input : keys[parseInt(input) - 1]; // Cek apakah input adalah nomor indeks atau nama

      if (!target || !(target in msgs)) throw `> Pesan ${input} tidak ditemukan`;

      if (/\d{5,16}@s\.whatsapp\.net$/.test(target)) {
        return m.reply(`Tidak dapat menghapus pesan yang terkait dengan nomor telepon atau JID`);
      }

      delete msgs[target];
      return m.reply(`> Pesan ${target} berhasil dihapus dari daftar pesan`);
    }

    // --list
    else if (text.includes("--list")) {
      let msgList = keys
        .map((nama, index) => `> *${index + 1}.* ${nama}`)
        .join("\n");

      if (msgList) {
        return m.reply(`*– 乂 Daftar Pesan Yang Tersedia*\n${msgList}`);
      } else {
        throw `Belum ada daftar pesan`;
      }
    } else {
      throw `> *– 乂 Panduan Penggunaan Perintah* 💡\n
            > 1. Gunakan *\`--add\`* untuk menambahkan pesan\n
            > 2. Gunakan *\`--delete\`* untuk menghapus pesan\n
            > 3. Gunakan *\`--list\`* untuk melihat daftar pesan\n\n
            > *– 乂 Daftar Pesan yang Tersedia :*\n
            ${keys.map((a, i) => `> *${i + 1}.* ${a}`).join("\n") || "Tidak ada pesan yang tersimpan."}`;
    }
  },
};