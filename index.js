(async () => {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers,
    proto,
    makeInMemoryStore,
    DisconnectReason,
    delay,
    generateWAMessage,
    getAggregateVotesInPollMessage,
    areJidsSameUser,
  } = require("baileys");
  const pino = require("pino");
  const { Boom } = require("@hapi/boom");
  const chalk = require("chalk");
  const readline = require("node:readline");
  const simple = require("./lib/simple.js");
  const fs = require("node:fs");
  const fetch = require("node-fetch");
  const path = require("path");
  const axios = require("axios");
  const pkg = require("./package.json");
  const NodeCache = require("node-cache");
  const moment = require("moment-timezone");
  const canvafy = require("canvafy");
  const Func = require("./lib/function.js");
  const Uploader = require("./lib/uploader.js");
  const Queque = require("./lib/queque.js");
  const messageQueue = new Queque();
  const Database = require("./lib/database.js");
  const append = require("./lib/append");
  const serialize = require("./lib/serialize.js");
  const config = require("./settings.js");
  const {
     jadibot,
     stopjadibot,
     listjadibot 
  } = require("./lib/jadibot.js");

  const appenTextMessage = async (m, sock, text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.key.remoteJid,
      {
        text: text,
      },
      {
        quoted: m.quoted,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return sock.ev.emit("messages.upsert", msg);
  };

  const question = (text) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(text, resolve);
    });
  };
  global.db = new Database(config.database + ".json");
  await db.init();

  global.pg = new (await require(process.cwd() + "/lib/plugins"))(
    process.cwd() + "/system/plugins",
  );
  await pg.watch();

  global.scraper = new (await require(process.cwd() + "/scrapers"))(
    process.cwd() + "/scrapers/src",
  );
  await scraper.watch();

  setInterval(async () => {
    await db.save();
    await pg.load();
    await scraper.load();
  }, 2000);

  global.axios = axios;
  global.fs = fs;
  global.cheerio = require("cheerio");
  global.block_message = new Set();
  global.lastCall = new Map();
  global.groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false});
  global.pickRandom = function pickRandom(list) {
     return list[Math.floor(Math.random() * list.length)];
  };
  
  const store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
  const logger = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
  }).child({ class: "MchaX-Bot" });
  logger.level = "fatal";
  console.log(chalk.magenta.bold(`
⠄⠄⠄⢰⣧⣼⣯⠄⣸⣠⣶⣶⣦⣾⠄⠄⠄⠄⡀⠄⢀⣿⣿⠄⠄⠄⢸⡇⠄⠄
⠄⠄⠄⣾⣿⠿⠿⠶⠿⢿⣿⣿⣿⣿⣦⣤⣄⢀⡅⢠⣾⣛⡉⠄⠄⠄⠸⢀⣿⠄
⠄⠄⢀⡋⣡⣴⣶⣶⡀⠄⠄⠙⢿⣿⣿⣿⣿⣿⣴⣿⣿⣿⢃⣤⣄⣀⣥⣿⣿⠄
⠄⠄⢸⣇⠻⣿⣿⣿⣧⣀⢀⣠⡌⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⣿⣿⣿⠄
⠄⢀⢸⣿⣷⣤⣤⣤⣬⣙⣛⢿⣿⣿⣿⣿⣿⣿⡿⣿⣿⡍⠄⠄⢀⣤⣄⠉⠋⣰
⠄⣼⣖⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⢇⣿⣿⡷⠶⠶⢿⣿⣿⠇⢀⣤
⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣷⣶⣥⣴⣿⡗
⢀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄
⢸⣿⣦⣌⣛⣻⣿⣿⣧⠙⠛⠛⡭⠅⠒⠦⠭⣭⡻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠄
⠘⣿⣿⣿⣿⣿⣿⣿⣿⡆⠄⠄⠄⠄⠄⠄⠄⠄⠹⠈⢋⣽⣿⣿⣿⣿⣵⣾⠃⠄
⠄⠘⣿⣿⣿⣿⣿⣿⣿⣿⠄⣴⣿⣶⣄⠄⣴⣶⠄⢀⣾⣿⣿⣿⣿⣿⣿⠃⠄⠄
⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⠄⣿⣿⡀⣾⣿⣿⣿⣿⣛⠛⠁⠄⠄⠄
⠄⠄⠄⠄⠈⠛⢿⣿⣿⣿⠁⠞⢿⣿⣿⡄⢿⣿⡇⣸⣿⣿⠿⠛⠁⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠉⠻⣿⣿⣾⣦⡙⠻⣷⣾⣿⠃⠿⠋⠁⠄⠄⠄⠄⠄⢀⣠⣴
⣿⣿⣿⣶⣶⣮⣥⣒⠲⢮⣝⡿⣿⣿⡆⣿⡿⠃⠄⠄⠄⠄⠄⠄⠄⣠⣴⣿⣿⣿
  `));
  
  console.log(chalk.blue.bold("\n– 乂 🤖 Info Bot:"));
  console.log(chalk.white.bold("  | Base Sc: ") + chalk.cyan.bold("https://github.com/AxellNetwork/nekoBot"));
  console.log(chalk.white.bold("  | GitHub: ") + chalk.cyan.bold("https://github.com/krsna081"));
  console.log(chalk.white.bold("  | Developer: ") + chalk.green.bold("krizz"));
  console.log(chalk.white.bold("  | Status Server: ") + chalk.green.bold("Online"));
  console.log(chalk.white.bold("  | Versi: ") + chalk.magenta.bold(pkg.version));
  console.log(chalk.white.bold("  | Versi Node.js: ") + chalk.magenta.bold(process.version));
  
  console.log(chalk.blue.bold("\n🔁 Memuat plugin dan scraper...")) 

  async function system() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessions);
    const sock = simple(
      {
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
        version: [2, 3000, 1019441105],
        browser: Browsers.ubuntu("Edge"),
        getMessage: async (key) => {
          const jid = jidNormalizedUser(key.remoteJid);
          const msg = await store.loadMessage(jid, key.id);
          return msg?.message || "";
        },
        shouldSyncHistoryMessage: (msg) => {
          console.log(`\x1b[32mMemuat chat [${msg.progress}%]\x1b[39m`);
          return !!msg.syncType;
        },
      },
      store,
    );
    global.mchax = sock;
    store.bind(sock.ev);
    if (!sock.authState.creds.registered) {
      console.log(
        chalk.white.bold(
          "- Silakan masukkan nomor WhatsApp Anda, misalnya 628xxxx",
        ),
      );
      const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
      const code = await sock.requestPairingCode(phoneNumber, "KRIZZ081");
      setTimeout(() => {
        console.log(chalk.white.bold("- Kode Pairing Anda: " + code));
      }, 3000);
    }

    //=====[ Pembaruan Koneksi ]======
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
          process.exit(0);
        } else if (reason === DisconnectReason.badSession) {
          console.log(
            chalk.red.bold("File sesi buruk, Harap hapus sesi dan scan ulang"),
          );
          process.exit(0);
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log(
            chalk.yellow.bold("Koneksi ditutup, sedang mencoba untuk terhubung kembali..."),
          );
          await system();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log(
            chalk.yellow.bold("Koneksi hilang, mencoba untuk terhubung kembali..."),
          );
          await system();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log(
            chalk.green.bold("Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan."),
          );
          sock.logout();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(
            chalk.green.bold("Perangkat logout, harap scan ulang."),
          );
          sock.logout();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log(chalk.green.bold("Restart diperlukan, sedang memulai ulang..."));
          await system();
        } else if (reason === DisconnectReason.timedOut) {
          console.log(
            chalk.green.bold("Koneksi waktu habis, sedang mencoba untuk terhubung kembali..."),
          );
          await system();
        }
      } else if (connection === "connecting") {
        console.log(chalk.blue.bold("Menghubungkan ke WhatsApp..."));
      } else if (connection === "open") {
          console.log(chalk.green.bold("Bot berhasil terhubung."));
          const sessionPath = path.join(__dirname, 'sessions');
          const jadibotPath = path.join(process.cwd(), "lib", "jadibot");
          const currentTime = new Date();
          const pingSpeed = new Date() - currentTime;
          const formattedPingSpeed = pingSpeed < 0 ? 'N/A' : `${pingSpeed}ms`;
          const infoMsg = `Laporan informasi terhubung, perangkat telah terhubung, berikut informasinya

*[ Tentang sistem ]*
- *User ID*: ${sock.user.id}
- *Name*: ${sock.user.name}
- *Kecepatan*: ${formattedPingSpeed}
- *Tanggal*: ${currentTime.toDateString()} (${currentTime.toLocaleDateString('id-ID', { weekday: 'long' })})
- *Waktu Saat Ini*: ${currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
`;

            const messg = await sock.sendMessage(`6281235807940@s.whatsapp.net`, {
                text: infoMsg,
                mentions: sock.parseMention(infoMsg)
            }, {
                quoted: config.quoted.floc
            });
          if (fs.existsSync(jadibotPath)) {
               const files = fs.readdirSync(jadibotPath).filter(file => /^\d+/.test(file));

               if (files.length > 0) {
                  console.log(chalk.yellow.bold(`Menjalankan ${files.length} jadibot...`));
               if (files.length === 1) {
                  const sender = files[0].replace(/\D/g, "") + "@s.whatsapp.net";
                  jadibot(sock, {}, sender).then(() => {
                  }).catch(err => {
                     return false;
              });
          } else {
             (async () => {
                 for (const file of files) {
                    const sender = file.replace(/\D/g, "") + "@s.whatsapp.net";
                    try {
                      await jadibot(sock, {}, sender);
                    } catch (err) {
                      return false;
                    }
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                })();
             }
         }
      }
      setInterval(async () => {
           if (!fs.existsSync(sessionPath)) return;
           let deletedFiles = [];
           fs.readdirSync(sessionPath).forEach(file => {
               if (file === 'creds.json' || file.startsWith('app-state')) return;
               const filePath = path.join(sessionPath, file);
               try {
                 fs.unlinkSync(filePath);
                 deletedFiles.push(file);
               } catch (err) {
                  console.error(`Gagal menghapus ${file}:`, err);
               }
           });

           if (deletedFiles.length > 0) {
               sock.sendMessage(config.owner + "@s.whatsapp.net", {
                   text: `♻️ *Auto Clear Session*\n> - *Jumlah sessions yang dihapus:* ${deletedFiles.length}`,
               }, { quoted: config.quoted.fkontak });
           }
        }, 60 * 60 * 1000);
      }
    });

    //=====[ Setelah Pembaruan Koneksi ]========//
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = {
            ...(store.contacts?.[id] || {}),
            ...(contact || {}),
          };
      }
    });

    sock.ev.on("contacts.upsert", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = { ...(contact || {}), isContact: true };
      }
    });

    sock.ev.on("groups.update", async (updates) => {
      for (const update of updates) {
        const id = update.id;
        const metadata = await sock.groupMetadata[id];
        groupCache.set(id, metadata);
        if (store.groupMetadata[id]) {
          store.groupMetadata[id] = {
            ...(store.groupMetadata[id] || {}),
            ...(update || {}),
          };
        }
      }
    });

    sock.ev.on("group-participants.update", ({ id, participants, action }) => {
      const metadata = sock.groupMetadata[id];
      groupCache.set(id, metadata);
      if (metadata) {
        switch (action) {
          case "add":
          case "revoked_membership_requests":
            metadata.participants.push(
              ...participants.map((id) => ({
                id: jidNormalizedUser(id),
                admin: null,
              })),
            );
            break;
          case "demote":
          case "promote":
            for (const participant of metadata.participants) {
              let id = jidNormalizedUser(participant.id);
              if (participants.includes(id)) {
                participant.admin = action === "promote" ? "admin" : null;
              }
            }
            break;
          case "remove":
            metadata.participants = metadata.participants.filter(
              (p) => !participants.includes(jidNormalizedUser(p.id)),
            );
            break;
        }
      }
    });
    
    sock.ev.on('presence.update', (m) => {
       if (!m) return
       const { id, presences } = m;
       if (id.endsWith('g.us')) {
          for (let jid in presences) {
             if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue
             if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db && db.list().user && db.list().user[jid] && db.list().user[jid].afk.afkTime > -1) {
                sock.sendMessage(id, { text: `Sistem mendeteksi aktivitas dari @${jid.replace(/@.+/, '')} setelah offline selama: ${Func.texted('bold', Func.toTime(new Date - db.list().user[jid].afk.afkTime))}\n\n➠ ${Func.texted('bold', 'Reason:')} ${db.list().user[jid].afk.afkReason ? db.list().user[jid].afk.afkReason : '-'}`, mentions: [jid] }, { quoted: db.list().user[jid].afk.afkObj });
                db.list().user[jid].afk.afkTime = -1
                db.list().user[jid].afk.afkReason = ''
                db.list().user[jid].afk.afkObj = {}
             }
          }
       } else { }
    });

    async function getMessage(key) {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg;
      }
      return {
        conversation: "NekoBot",
      };
    }

    sock.ev.on("call", async (calls) => {
      if (!db.list().settings.anticall) return;
      for (const call of calls) {
        if (!call.id || !call.from) continue;
    
        let lastTime = lastCall.get(call.from);
        let now = Date.now();
    
        if (!lastTime || now - lastTime > 5000) {
          lastCall.set(call.from, now);
          await sock.rejectCall(call.id, call.from);
          await sock.sendMessage(call.from, {
            text: "> 🚫 *Mohon maaf*... Kami tidak bisa menerima telepon dari Anda, anti call aktif!",
            mentions: [call.from],
          });
        }
      }
    })
    
    sock.ev.on("messages.upsert", async (cht) => {
        if (cht.messages.length === 0) return;  
        const chatUpdate = cht.messages[0];
        if (!chatUpdate.message) return;    
        const userId = chatUpdate.key.id;
        global.m = await serialize(chatUpdate, sock, store)
        if (m.isBot) {
            if (block_message.has(userId)) return;
            block_message.add(userId);
            setTimeout(() => block_message.delete(userId), 5 * 60 * 1000);
        }
        require("./lib/logger.js")(m);
        await require("./system/handler.js")(m, sock, store);
    });

    sock.ev.on("messages.update", async (chatUpdate) => {
      for (const { key, update } of chatUpdate) {
        if (update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            let pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation?.message,
              pollUpdates: update.pollUpdates,
            });
            let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
              ?.name;
            console.log(toCmd);
            await appenTextMessage(m, sock, toCmd, pollCreation);
            await sock.sendMessage(m.cht, { delete: key });
          } else return false;
          return;
        }
      }
    });
    return sock;
  }
  system();
})();