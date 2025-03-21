# **😼 MchaX-Bot | 1.7.0** | ***create by krizz***


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

## Using access number, user, & password
kalian bisa edit sendiri ya kalo males minta acc ke saya, letaknya di **lib/akses.js** dan isi dari raw GitHub sperti ini kira-kira

```
[
  {
    "user": "admin",
    "pw": "123",
    "owner": "6281235807940"
  },
  // jika lebih dari 1 maka tambah fungsi sama seperti di atas!
]
```

Owner itu di ambil dari **settings.js** di **owner** array ke 1 jika ada 2 nomor di bot kalian maka cukup masukkan yang ke 1 saja di raw GitHub nya!.. ohh iya ini bisa raw bebas ya, bisa **pastebin, pastelink** dan sejenisnya yang penting public saja.. Kenapa saya make GitHub? Karena sudah ada akses manual lewat botnya jika running.. Di plugins **owner/akses.js** kalian bisa edit menggunakan api GitHub kalian sendiri... Terimakasih 🙏, salam dua jari 🤙

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
  pushName: 'krizz kecil',
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
  owner: [
    "6281235807940"
  ],
  name: "© MchaX-Bot - Simple WhatsApp bot by K For Krisnoll",
  sessions: "sessions",
  prefix: [
    ".",
    "?",
    "!",
    "/"
  ],
  database_url: "",
  sticker: {
    packname: "✨ MchaX-Bot ✨",
    author: "🐾 K For Krisnoll 🐾"
  },
  id: {
    newsletter: "120363218091403108@newsletter",
    group: "120363361348319166@g.us"
  },
  cpanel: {
    domain: "https://example.com",
    apikey: "plta_",
    nets: 5,
    egg: 16
  },
  messages: {
    wait: "*( Loading )* Tunggu Sebentar...",
    owner: "*( Denied )* Kamu bukan owner ku !",
    premium: "*( Denied )* Fitur ini khusus user premium",
    group: "*( Denied )* Fitur ini khusus group",
    private: "*( Denied )* Fitur ini khusus private",
    admin: "*( Denied )* Lu siapa bukan Admin group",
    botAdmin: "*( Denied )* Jadiin MchaX-Bot admin dulu baru bisa akses"
  },
  database: "mchax-db",
  tz: "Asia/Jakarta",
  quoted: {
    fpack: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net"
      },
      message: {
        pollCreationMessageV3: {
          name: "© MchaX-Bot | Playground",
          options: [
            {
              optionName: "1"
            },
            {
              optionName: "2"
            }
          ],
          selectableOptionsCount: 0
        }
      }
    },
    fvent: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net"
      },
      message: {
        eventMessage: {
          isCanceled: false,
          name: "© MchaX-Bot | Playground",
          description: "...",
          startTime: "1738760400"
        }
      }
    },
    fvn: {
      key: {
        participant: "0@s.whatsapp.net"
      },
      message: {
        audioMessage: {
          mimetype: "audio/ogg; codecs=opus",
          seconds: 359996400,
          ptt: true
        }
      }
    },
    fgif: {
      key: {
        participant: "0@s.whatsapp.net"
      },
      message: {
        videoMessage: {
          title: "© MchaX-Bot | Playground",
          seconds: 359996400,
          gifPlayback: true,
          caption: "© MchaX-Bot | Playground"
        }
      }
    },
    fgclink: {
      key: {
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net"
      },
      message: {
        groupInviteMessage: {
          groupJid: "120363361348319166@g.us",
          inviteCode: "m",
          groupName: "© MchaX-Bot | Playground",
          caption: "Lihat Undangan"
        }
      }
    },
    fvideo: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net"
      },
      message: {
        videoMessage: {
          title: "© MchaX-Bot | Playground",
          seconds: 359996400,
          caption: "© MchaX-Bot | Playground"
        }
      }
    },
    floc: {
      key: {
        participant: "0@s.whatsapp.net"
      },
      message: {
        locationMessage: {
          name: "© MchaX-Bot | Playground"
        }
      }
    },
    fkontak: {
      key: {
        participant: "0@s.whatsapp.net"
      },
      message: {
        contactMessage: {
          displayName: "© MchaX-Bot | Playground",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nN:XL;Krisnoll;;;\nFN:Krisnoll\nEND:VCARD"
        }
      }
    },
    fstat: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net"
      },
      message: {
        imageMessage: {
          url: "https://example.com/image.jpg",
          mimetype: "image/jpeg",
          caption: "© MchaX-Bot | Playground"
        }
      }
    }
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

[![WhatsApp Group](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/Kk4OfajNSAQB6Oq3LrKF41)

[![WhatsApp channel](https://img.shields.io/badge/WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VaOQ0f3BA1f7HHV9DV1J)

