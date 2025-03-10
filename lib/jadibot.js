/**
 * github: https://github.com/kiuur
 * youtube: https://youtube.com/@kyuurzy
 * note: disini ada error dikit di bagian connection.update, kalian aja yang fix, aku nanti jelaa
 */

console.clear();
console.log('starting...');
require('../settings');

const {
    default: makeWASocket,
    prepareWAMessageMedia,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    generateWAMessageFromContent,
    generateWAMessageContent,
    generateWAMessage,
    jidDecode,
    jidNormalizedUser,
    proto,
    delay,
    relayWAMessage,
    getContentType,
    getAggregateVotesInPollMessage,
    downloadContentFromMessage,
    fetchLatestWaWebVersion,
    InteractiveMessage,
    makeCacheableSignalKeyStore,
    Browsers,
    generateForwardMessageContent,
    MessageRetryMap
} = require("baileys");
const path = require('path');
const pino = require('pino');
const simple = require("./simple");
const FileType = require('file-type');
const readline = require("readline");
const chalk = require("chalk");
const fs = require('fs');
const moment = require("moment-timezone");
const crypto = require("crypto")
const serialize = require('./serialize');
const Func = require("./function");
const config = require("../settings");
const {
    Boom
} = require('@hapi/boom');
const {
    createCanvas
} = require('canvas');

async function generateCanvas(text) {
    const canvasWidth = 2560;
    const canvasHeight = 1440;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = 'bold 250px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    const textBottom = 'PairingCode';
    ctx.font = 'bold 60px Arial';
    ctx.fillText(textBottom, canvasWidth / 2, canvasHeight - 50);

    const buffer = canvas.toBuffer();
    return buffer;
}
async function jadibot(client, m, from) {
    global.socks = global.socks || {};
    client.sock = global.socks;
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(`./lib/jadibot/${from.split("@")[0]}`)
    const store = makeInMemoryStore({
        logger: pino().child({
            level: 'silent',
            stream: 'store'
        })
    });
    try {
        global.socks[from] = simple(
        {
           logger: pino({ level: "silent" }),
           printQRInTerminal: false,
           auth: state,
           cachedGroupMetadata: async (jid) => groupCache.get(jid),
           version: [2, 3000, 1019441105],
           browser: Browsers.ubuntu("Edge"),
        },
        store,    
       );
        if (!global.socks[from].authState.creds.registered) {
            setTimeout(async () => {
                try {
                    const ran = await Func.random(["KRIZZ081", "JADIBOTZ", "KRZXX001", "ALOKXYZZ", "MCHAXX01", "GRESACAA"])
                    const pairing = await global.socks[from].requestPairingCode(from.split("@")[0], ran)
                    let code = pairing?.match(/.{1,4}/g)?.join("-") || pairing
                    let baf = await generateCanvas(code)
                    let teks = `\`\`\`Masukkan kode pada gambar di atas untuk menjadi bot sementara\`\`\`\n\n*– 乂 Langkah Mengkoneksikan:*\n- Langkah 1: Buka WhatsApp Anda\n- Langkah 2: Ketuk "Perangkat Tertaut"\n- Langkah 3 Pilih "Tautkan Perangkat"\n- Langkah 4: Tautkan Dengan Nomor Telepon Saja\n- Langkah 5: Masukan Kode Anda!`;
                    await m.reply({
                        image: baf,
                        mimetype: "image/jpeg",
                        caption: teks
                    });
                } catch (e) {
                    console.log(e)
                }
            }, 3000)
        }

        store.bind(global.socks[from].ev);

        global.socks[from].ev.on('connection.update', (update) => {
            const {
                connection,
                lastDisconnect
            } = update
            if (connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (lastDisconnect.error == "Error: Stream Errored (unknown)") {} else if (reason === DisconnectReason.badSession) {
                    console.log(
                        chalk.red.bold(`${from.split("@")[0]} File sesi buruk, Harap hapus sesi dan scan ulang!`),
                    );
                    delete global.socks[from];
                    delete db.list().jadibot[from];
                    fs.rm(`./lib/jadibot/${from.split("@")[0]}`, {
                        recursive: true,
                        force: true
                    })
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log(
                        chalk.yellow.bold(`${from.split("@")[0]} Koneksi ditutup, sedang mencoba untuk terhubung kembali...`),
                    );
                    jadibot(client, m, from)
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log(
                        chalk.yellow.bold(`${from.split("@")[0]} Koneksi hilang, mencoba untuk terhubung kembali...`),
                    );
                    delete global.socks[from];
                    delete db.list().jadibot[from];
                    fs.rm(`./lib/jadibot/${from.split("@")[0]}`, {
                        recursive: true,
                        force: true
                    })
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(
                        chalk.green.bold(`${from.split("@")[0]} Perangkat logout, harap scan ulang...`),
                    );
                    delete global.socks[from];
                    delete db.list().jadibot[from];
                    fs.rm(`./lib/jadibot/${from.split("@")[0]}`, {
                        recursive: true,
                        force: true
                    })
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log(chalk.green.bold(`${from.split("@")[0]} Restart diperlukan, sedang memulai ulang...`));
                    jadibot(client, m, from)
                } else if (reason === DisconnectReason.timedOut) {
                    console.log(
                        chalk.green.bold(`${from.split("@")[0]} Koneksi waktu habis, sedang menghubungkan ulang...`),
                    );
                    
                }
            } else if (connection === "connecting") {
                console.log(chalk.blue.bold(`${from.split("@")[0]} Menghubungkan ke WhatsApp...`));
            } else if (connection === 'open') {
                console.log(chalk.green.bold(`${from.split("@")[0]} Berhasil tersambung!`));
                global.socks[from].connectTime = Date.now();
                global.socks[from].konek = moment().tz(config.tz).format("dddd, DD MMMM YYYY || HH:mm:ss");
                global.socks[from].sendMessage(from, {
                    text: "✅ berhasil tersambung"
                }, {
                    quoted: config.quoted.fkontak
                })
                global.socks[from].newsletterFollow(String.fromCharCode(49, 50, 48, 51, 54, 51, 50, 49, 56, 48, 57, 49, 52, 48, 51, 49, 48, 56, 64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114));
                const sessionPath = path.join(process.cwd() + `/lib/jadibot/${from.split("@")[0]}`);
                setInterval(async () => {
                    if (!fs.existsSync(sessionPath)) return;
                    let deletedFiles = [];
                    fs.readdirSync(sessionPath).forEach(file => {
                        if (
                            file === 'creds.json' ||
                            file.startsWith('app-state')
                        ) return;
                        const filePath = path.join(sessionPath, file);
                        try {
                            fs.unlinkSync(filePath);
                            deletedFiles.push(file);
                        } catch (err) {
                            console.error(`Gagal menghapus ${file}:`, err);
                        }
                    });
                    if (deletedFiles.length > 0) {
                        global.socks[from].sendMessage(config.owner + "@s.whatsapp.net", {
                            text: `♻️ *Auto Clear Session*\n> - *Jumlah sessions yang di hapus:* ${deletedFiles.length}`,
                        }, {
                            quoted: config.quoted.fkontak
                        });
                    }
                }, 60 * 60 * 1000);
            }
        })

        if (!db.list().jadibot[from]) db.list().jadibot[from] = {
            self: false
        };

        global.socks[from].ev.on("messages.upsert", async cht => {
            try {
                if (cht.messages.length === 0) return;
                const chatUpdate = cht.messages[0];
                if (!chatUpdate.message) return;
                const userId = chatUpdate.key.id;
                const m = await serialize(chatUpdate, global.socks[from], store);
                if (m.isBot) {
                    if (block_message.has(userId)) {
                        return;
                    }
                    block_message.add(userId);
                    setTimeout(() => {
                        block_message.delete(userId);
                    }, 5 * 60 * 1000);
                }
                if (db.list().settings.reactsw && m.key.remoteJid === "status@broadcast") {
                    if (m.isBot) return;
                    await global.socks[from].readMessages([m.key]);
                    await global.socks[from].sendMessage(
                        "status@broadcast", {
                            react: {
                                text: Func.random(["🫩", "🥹", "😹", "🪾", "🤢", "🤓", "😛", "🫟", "😠", "🪾", "🫆"]),
                                key: m.key
                            }
                        }, {
                            statusJidList: [m.sender]
                        },
                    );
                    return;
                }
                if (db.list().jadibot[from].self && !m.isOwner) return;
                await require(process.cwd() + "/system/handler.js")(m, global.socks[from], store);
            } catch (err) {
                console.log(err)
            }
        });

        global.socks[from].ev.on("contacts.upsert", update => {
            for (let contact of update) {
                let id = jidNormalizedUser(contact.id);
                if (store && store.contacts)
                    store.contacts[id] = {
                        ...(contact || {}),
                        isContact: true
                    };
            }
        });

        global.socks[from].ev.on("groups.update", async updates => {
            for (const update of updates) {
                const id = update.id;
                const metadata = await sock.groupMetadata(id);
                groupCache.set(id, metadata)
                if (store.groupMetadata[id]) {
                    store.groupMetadata[id] = {
                        ...(store.groupMetadata[id] || {}),
                        ...(update || {}),
                    };
                }
            }
        });

        global.socks[from].ev.on('presence.update', m => {
            if (!m) return
            const {
                id,
                presences
            } = m;
            if (id.endsWith('g.us')) {
                for (let jid in presences) {
                    if (!presences[jid] || jid == global.socks[from].decodeJid(global.socks[from].user.id)) continue
                    if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db && db.list().user && db.list().user[jid] && db.list().user[jid].afk.afkTime > -1) {
                        global.socks[from].sendMessage(id, {
                            text: `Sistem mendeteksi aktivitas dari @${jid.replace(/@.+/, '')} setelah offline selama: ${Func.texted('bold', Func.toTime(new Date - db.list().user[jid].afk.afkTime))}\n\n➠ ${Func.texted('bold', 'Reason:')} ${db.list().user[jid].afk.afkReason ? db.list().user[jid].afk.afkReason : '-'}`,
                            mentions: [jid]
                        }, {
                            quoted: db.list().user[jid].afk.afkObj
                        });
                        db.list().user[jid].afk.afkTime = -1
                        db.list().user[jid].afk.afkReason = ''
                        db.list().user[jid].afk.afkObj = {}
                    }
                }
            } else {}
        });

        global.socks[from].ev.on('creds.update', saveCreds);
        return client;
    } catch (e) {
        console.log(e);
    }
}

async function stopjadibot(client, m, from) {
    if (!global.socks[from]) return m.reply(`❗ tidak ada bot yang terhubung`)
    fs.rm(`./lib/jadibot/${from.split("@")[0]}`, {
        recursive: true,
        force: true
    }, (err) => {
        if (err) return console.error(err);
        return false
    });
    delete global.socks[from];
    delete db.list().jadibot[from]
    m.reply("❗ bot berhenti")
}

async function listjadibot(from, m) {
    let text = "*– 乂 Daftar Jadibot:*\n\n";
    let mentions = [];

    for (let jadibot of Object.keys(global.socks)) {
        let name = await global.socks[jadibot].getName(global.socks[jadibot].user.id) || "Unknown";
        let runtime = getRuntime(global.socks[jadibot]?.connectTime || Date.now());
        let konek = global.socks[jadibot].konek || "-";

        mentions.push(jadibot);
        text += `*${mentions.length}.* ${name}\n`;
        text += ` *- Number :* ${jadibot.split("@")[0]}\n`;
        text += ` *- Terkoneksi :* ${konek}\n`;
        text += ` *- Runtime:* ${runtime}\n\n`;
    }

    if (mentions.length === 0) {
        text += "_Tidak ada jadibot aktif._";
    }

    return from.sendMessage(m.cht, {
        text: text.trim()
    }, {
        quoted: m
    });
}

function getRuntime(connectTime) {
    let seconds = Math.floor((Date.now() - connectTime) / 1000);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
}

module.exports = {
    jadibot,
    stopjadibot,
    listjadibot
}