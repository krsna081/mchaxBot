**😼 mchaxBot | 1.7.0** | ***create by krizz***


## 📜 Introduction  

**MchaX-Bot** adalah bot WhatsApp berbasis **Baileys** yang dirancang untuk **otomatisasi, moderasi, dan hiburan** dalam grup maupun chat pribadi.  
Bot ini menawarkan berbagai fitur seperti:  

✅ **Command otomatis** untuk admin dan pengguna umum  
✅ **Manajemen grup** (ban, kick, promote, demote)  
✅ **Fitur media** (sticker maker, downloader, AI chat)  
✅ **Kustomisasi & pengaturan fleksibel**  

Dibangun dengan **Node.js** dan **Baileys**, MchaX-Bot mudah dikembangkan dan dikustomisasi sesuai kebutuhanmu! 🚀  

### 🔥 Kenapa memilih MchaX-Bot?  
✔️ **Ringan & cepat** – Tidak membebani server dan berjalan stabil  
✔️ **Open Source** – Dapat dimodifikasi dan dikembangkan lebih lanjut  
✔️ **Multi-device support** – Bisa digunakan di WA MD (Multi-Device)  
✔️ **Dukungan komunitas** – Update berkala dan fitur terbaru

## Simple WhatsApp bot Using Library Baileys
```javascript
{
  message: Message { conversation: '>_ Welcome to mchaxBot' },
  type: 'conversation',
  msg: '>_ Welcome to mchaxBot',
  isMedia: false,
  key: {
    remoteJid: '6285165556936@s.whatsapp.net',
    participant: '6285165556936@s.whatsapp.net',
    fromMe: false,
    id: '5780C33F89C0BE600B6D71DF79C4FC02'
  },
  cht: '6285165556936@s.whatsapp.net',
  fromMe: false,
  id: '5780C33F89C0BE600B6D71DF79C4FC02',
  device: 'android',
  isBot: false,
  isGroup: false,
  participant: '6285165556936@s.whatsapp.net',
  sender: '6285165556936@s.whatsapp.net',
  mentions: [],
  body: '>_ Welcome to NekoBot',
  prefix: '',
  command: '>_',
  args: [ 'Welcome', 'to', 'NekoBot' ],
  text: 'Welcome to NekoBot',
  isOwner: true,
  download: [AsyncFunction (anonymous)]
}
```

## ⚙️ Settings Bot ***( settings.js )***
```javascript
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
    fswtag: { key: {  fromMe: false, participant: "0@s.whatsapp.net" }, message: { groupStatusMentionMessage: { message: { protocolMessage: { key: m.key,  type: 25 } } } } },
    fvideo: { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { videoMessage: { title: "© MchaX-Bot | Playground", seconds: 359996400, caption: "© MchaX-Bot | Playground" } } },
    floc: { key: { participant: "0@s.whatsapp.net" }, message: { locationMessage: { name: "© MchaX-Bot | Playground" } } },
    fkontak: { key: { participant: "0@s.whatsapp.net" }, message: { contactMessage: { displayName: "© MchaX-Bot | Playground", vcard: "BEGIN:VCARD\nVERSION:3.0\nN:XL;Krisnoll;;;\nFN:Krisnoll\nEND:VCARD" } } },
    fstat: { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { imageMessage: { url: "https://example.com/image.jpg", mimetype: "image/jpeg", caption: "© MchaX-Bot | Playground" } } },
  }
};

module.exports = config;
```

## 👨‍💻 How to install/run
```bash
$ git clone https://github.com/krsna081/mchaxBot
$ cd mchaxBot
$ npm install
$ npm start
```

## ☘️ Example Features
Berikut cara menambahkan fitur pada bot ini

## 1. Plugins
```javascript

module.exports = {
    command: "tes", //- Nama fitur nya
    alias: ["tesbot", "testing"], //- Short cut command
    category: ["main"], //- Kategori Fitur 
    settings: {
        owner: false, //-  Apakah Fitur ini khusus owner ?
        group: false, // - Apakah Fitur ini khusus group ?
     },
    description: "Tes bot saja", //- Penjelasan tentang fitur nya
    loading: true, //- Ingin menambahkan loading messages ?
 async run(m, { sock, Func, Scraper, text, config }) {
    m.reply("> Bot Online ✓")
  }
}
```
## 2. Case
```javascript
case "tes" : {
     m.reply("> Bot Online ✓")
   }
break
```

## 🎉 Thanks To
Terima kasih kepada mereka yang berkontribusi dalam pengembangan **MchaX-Bot**:  
- **[AxelNetwork](https://github.com/AxellNetwork)** Base Bot
- **Myself**  Creator Blakutik
- **My Girlfriend** Dukungan & Inspirasi
- **Para pengguna & tester** yang telah mencoba dan memberikan masukan  
- **Komunitas Bot WhatsApp** atas dukungan dan inspirasinya
## 📢 Discussion 
Jika ingin mengenal seputar Script ini lebih dalam lagi
silahkan mampir ke komunitas kami

[![WhatsApp Group](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/DRnyflOHxnT1LXY4lmvZ89)

[![WhatsApp channel](https://img.shields.io/badge/WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J)

