const fs = require("node:fs");

const config = {
  owner: ["628xxxx"],
  name: "© MchaX-Bot - Simple WhatsApp bot by K For Krisnoll",
  sessions: "sessions",
  prefix: [".", "?", "!", "/"],
  sticker: {
    packname: "✨ MchaX-Bot ✨",
    author: "🐾 K For Krisnoll 🐾",
  },
  id: {
    newsletter: "1203xxxx@newsletter",
    group: "1203xxxx@g.us",
  },
  messages: {
    wait: "> ⏳ *Mohon tunggu sebentar*... Kami sedang memproses permintaan Anda, harap bersabar ya!", 
    owner: "> 🧑‍💻 *Fitur ini hanya untuk pemilik bot*... Maaf, Anda tidak memiliki akses ke fitur ini.", 
    premium: "> 🥇 *Upgrade ke Premium* untuk mendapatkan akses ke fitur eksklusif, murah dan cepat! Hubungi admin untuk info lebih lanjut.", 
    group: "> 👥 *Fitur ini hanya tersedia di grup*... Pastikan Anda berada di grup WhatsApp untuk mengakses fitur ini.",
    admin: "> ⚠️ *Anda harus menjadi admin grup* untuk menggunakan fitur ini, karena bot memerlukan hak akses admin.", 
    botAdmin: "> 🛠️ *Jadikan MchaX-Bot sebagai admin* grup untuk menggunakan fitur ini. Pastikan Anda memberikan hak admin kepada bot.",
  },
  database: "neko-db",
  tz: "Asia/Jakarta",

  quoted: {
    fpack: { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { pollCreationMessageV3: { name: "© MchaX-Bot | Playground", options: [{ optionName: "1" }, { optionName: "2" }], selectableOptionsCount: 0 } } },
    fvent: { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { eventMessage: { isCanceled: false, name: "© MchaX-Bot | Playground", description: "...", startTime: "1738760400" } } },
    fvn: { key: { participant: "0@s.whatsapp.net" }, message: { audioMessage: { mimetype: "audio/ogg; codecs=opus", seconds: 359996400, ptt: true } } },
    fgif: { key: { participant: "0@s.whatsapp.net" }, message: { videoMessage: { title: "© MchaX-Bot | Playground", seconds: 359996400, gifPlayback: true, caption: "© MchaX-Bot | Playground" } } },
    fgclink: { key: { participant: "0@s.whatsapp.net", remoteJid: "0@s.whatsapp.net" }, message: { groupInviteMessage: { groupJid: "1203xxxx@g.us", inviteCode: "m", groupName: "© MchaX-Bot | Playground", caption: `Lihat Undangan` } } },
    fsaluran: { key : { remoteJid: '0@s.whatsapp.net', participant : '0@s.whatsapp.net' }, message: { newsletterAdminInviteMessage: { newsletterJid: "1203xxxx@newsletter", newsletterName: "© MchaX-Bot | Playground", caption: "© MchaX-Bot | Playground" } } },
    fvideo: { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { videoMessage: { title: "© MchaX-Bot | Playground", seconds: 359996400, caption: "© MchaX-Bot | Playground" } } },
    floc: { key: { participant: "0@s.whatsapp.net" }, message: { locationMessage: { name: "© MchaX-Bot | Playground" } } },
    fkontak: { key: { participant: "0@s.whatsapp.net" }, message: { contactMessage: { displayName: "© MchaX-Bot | Playground", vcard: "BEGIN:VCARD\nVERSION:3.0\nN:XL;Krisnoll;;;\nFN:Krisnoll\nEND:VCARD" } } },
    fstat: { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { imageMessage: { url: "https://example.com/image.jpg", mimetype: "image/jpeg", caption: "© MchaX-Bot | Playground" } } },
  }
};

module.exports = config;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
});