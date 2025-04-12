// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const schedule = require("node-schedule");
const chalk = require("chalk");
const Func = require("./function");
const Uploader = require("./uploader");
const config = require(process.cwd() + "/settings");
const moment = require("moment-timezone")
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fakeUserAgent = require("fake-useragent");

async function Analyze(teks) {
    try {
        const result = await axios.post("https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyAOvxdB7IKKA0TphPvY2sFMlHDWBVLlV9o", {
            comment: {
                text: teks,
                type: "PLAIN_TEXT"
            },
            languages: ["id"],
            requestedAttributes: {
                SEVERE_TOXICITY: {},
                INSULT: {}
            }
        });

        return {
            toxicity: result.data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
            insult: result.data.attributeScores.INSULT.summaryScore.value,
            combined: (result.data.attributeScores.SEVERE_TOXICITY.summaryScore.value + result.data.attributeScores.INSULT.summaryScore.value) / 2
        };
    } catch (e) {
        console.error(e);
        return {
            toxicity: NaN,
            insult: NaN,
            combined: NaN
        };
    }
}
const tmpFolder = path.join(process.cwd(), "tmp");
async function cekGambar(imgPath, mime) {
    try {
        if (!fs.existsSync(imgPath)) {
            return {
                nsfw: 0,
                msg: "Gambar tidak ditemukan."
            };
        }

        const data = new FormData();
        data.append("media", fs.createReadStream(imgPath));
        data.append("workflow", "wfl_gupRbEZFpM1y7RUxybnYR");
        data.append("api_user", "982059457");
        data.append("api_secret", "NSrgW7G6YYWmQPNraoh986DQXSxENqZ9");

        const response = await axios.post("https://api.sightengine.com/1.0/check-workflow.json", data, {
            headers: {
                "User-Agent": fakeUserAgent(),
            },
        });

        const rejectReason = response.data.summary.reject_reason?.[0]?.text || "Unknown";
        const rejectScore = response.data.nudity?.sexual_activity || 0;

        let type = "file";
        if (mime.includes("webp")) type = "stiker";
        else if (mime.includes("image")) type = "gambar";
        else if (mime.includes("video")) type = "video";

        fs.unlinkSync(imgPath);

        return {
            nsfw: response.data.summary.reject_prob,
            msg: `*– 乂 Anti Porno - Detector*\n> - *Nama :* ${rejectReason}\n> - *Tindakan :* ${response.data.summary.action}\n> - *Skor :* ${rejectScore}%\n\nMaaf, saya akan menghapus ${type} yang Anda kirim!`,
        };
    } catch (error) {
        console.error("Kesalahan dalam pemeriksaan gambar:", error);
        return {
            nsfw: 0,
            msg: "Gagal memeriksa gambar."
        };
    }
}

module.exports = async (m, sock, store) => {
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const sentMessages = {};
const reminderSent = new Map();
const groupStatus = new Map();
const linkRegex = /(chat.whatsapp.com|whatsapp.com)\/([0-9A-Za-z]{1,99999})/i;
const users = db.list().user[m.sender];
const groups = db.list().group[m.cht];
const settings = db.list().settings;

if (settings.reactsw && m.key.remoteJid === "status@broadcast") {
    if (m.isBot) return;
    await sock.readMessages([m.key]);
    await sock.sendMessage(
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

if (m.isGroup) {
    if (m.isBot) {
        if (!m.isBotAdmin || m.isAdmin || !groups.anti.bot) return;
        m.reply(`*– 乂 Anti Bot - Detector*
Maaf, bot lain tidak diperbolehkan dalam grup ini!

*– 乂 Metadata Info:*
> - *Jenis:* ${m.type}
> - *isBaileys:* ${m.isBot}
> - *Panjang ID:* ${m.id?.length || "Tidak ada ID"}

#${m.id || "Tidak ada ID"}`);

        await sock.sendMessage(m.cht, {
            delete: m.key
        });
        await sock.groupParticipantsUpdate(m.cht, [m.sender], "remove");
        await sock.delay(2000);
    }
}
if (m.isGroup) {
    if (m.message?.groupStatusMentionMessage ||
        (m.message?.futureProofMessage?.message?.protocolMessage?.type === 25)) {
        if (!m.isBotAdmin || m.isAdmin || !groups.anti.gctag) return;

        users.warn += 1;
        await m.reply(`${users.warn >= 5 ? `*– 乂 Anti Tag Group - Detector* 
Maaf, Anda tidak diperbolehkan menandai grup ini secara langsung!
Anda telah menerima peringatan ${users.warn}/5.` : `*– 乂 Anti Tag Group - Detector* 
Dilarang menandai grup secara langsung! +1 Warn (Total Warn: ${users.warn}/5).`}`);

        await sock.sendMessage(m.cht, {
            delete: m.key
        });

        if (users.warn >= 5) {
            users.warn = 0;
            await sock.groupParticipantsUpdate(m.cht, [m.sender], "remove");
            await sock.delay(2000);
        }
    }
}
let mime = m.msg?.mimetype || "";
if (m.isGroup) {
    if (mime) {
        if (!m.isBotAdmin || m.isAdmin || !groups.anti.nsfw) return;
        try {
            const buffer = await m?.download();
            const fileName = `tmp-${Date.now()}.${mime.split("/")[1]}`;
            const filePath = path.join(tmpFolder, fileName);

            fs.writeFileSync(filePath, buffer);

            const detect = await cekGambar(filePath, mime);
            if (detect.nsfw > 0.25) {
                await m.reply(detect.msg);
                await sock.sendMessage(m.cht, {
                    delete: {
                        ...m.key
                    }
                });
            }
        } catch (error) {
            console.error("Kesalahan saat memproses gambar:", error);
        }
    }
}
if (m.isGroup) {
    if (m.isAdmin || !m.isBotAdmin || !groups.anti.toxic) return;
    let tes = await Analyze(m.body);
    let num = parseFloat((100 * tes.toxicity).toFixed(2));
    if (tes) {
        if (num > 60) {
            m.reply(`*– 乂 Anti Toxic - Detector*\nMaaf saya harus kick kamu\ngroup ini tidak menerima member toxic!\n> - *Toxic Strength :* ${num}%`);
            await sock.groupParticipantsUpdate(m.cht, [m.sender], "remove");
        } else if (num > 50) {
            users.warn += 1;
            if (users.warn >= 5) {
                m.reply(`*– 乂 Anti Toxic - Detector*\nKamu telah menerima 5 kali peringatan karena toxic!\nSaya harus mengeluarkan kamu dari grup.\n\n> - *Toxic Strength :* ${num}%`);
                await sock.groupParticipantsUpdate(m.cht, [m.sender], "remove");
                users.warn = 0;
            } else {
                m.reply(`*– 乂 Anti Toxic - Detector*\nKeterlaluan kamu toxic-nya!\n+1 Warn (Total Warn: ${user.warn}/5)\n\n> - *Toxic Strength :* ${num}%`);
                await sock.sendMessage(m.cht, {
                    delete: m.key
                });
            }
        } else if (num > 30) {
            m.reply(`*– 乂 Anti Toxic - Detector*\nKalem dong jangan toxic\n\n> - *Toxic Strength :* ${num}%`);
            await sock.sendMessage(m.cht, {
                delete: m.key
            });
        } else if (num > 3) {
            m.reply(`*– 乂 Anti Toxic - Detector*\nKalem dong jangan toxic\n\n> - *Toxic Strength :* ${num}%`);
            await sock.sendMessage(m.cht, {
                delete: m.key
            });
        }
    }
}
if (m.isGroup) {
    let isGroupLink = linkRegex.exec(m.body);
    if (isGroupLink) {
        if (!m.isBotAdmin || m.isAdmin || !groups.anti.link) return;

        let thisGroup = `https://chat.whatsapp.com/${await sock.groupInviteCode(m.cht)}`;
        if (m.body.includes(thisGroup)) return;

        users.warn += 1;
        m.reply(`${users.warn >= 5 ? `*– 乂 Anti Link - Detector* 
Maaf, Anda tidak dapat mengirim url lain ke grup ini!
Anda telah menerima peringatan ${users.warn}/5.` : `*– 乂 Anti Link - Detector* 
Maaf, Anda tidak dapat mengirim url lain ke grup ini.
Anda telah menerima ${users.warn}/5 peringatan.`}`);

        await sock.sendMessage(m.cht, {
            delete: m.key
        });

        if (users.warn >= 5) {
            users.warn = 0;
            await sock.groupParticipantsUpdate(m.cht, [m.sender], "remove");
            await sock.delay(2000);
        }
    }
}

schedule.scheduleJob("* * * * *", async () => {
    const currentTime = moment().tz(config.tz).format("HH:mm");
    const currentDate = moment().tz(config.tz).format("YYYY-MM-DD");

    for (const chatId in db.list().gcauto) {
        try {
            const { close, open } = db.list().gcauto[chatId];
            const closeReminderTime = moment(close, "HH:mm").subtract(5, "minutes").format("HH:mm");
            const openReminderTime = moment(open, "HH:mm").subtract(5, "minutes").format("HH:mm");

            // Periksa & Kirim Pengingat Sebelum Menutup Grup
            if (currentTime === closeReminderTime && reminderSent.get(`${chatId}-close`) !== currentDate) {
                reminderSent.set(`${chatId}-close`, currentDate);
                await delay(5000);
                await sock.sendMessage(chatId, {
                    text: "*( P E R I N G A T A N )*\n<~> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴅɪᴛᴜᴛᴜᴘ ᴅᴀʟᴀᴍ 5 ᴍᴇɴɪᴛ <~>"
                });
            }

            // Periksa & Kirim Pengingat Sebelum Membuka Grup
            if (currentTime === openReminderTime && reminderSent.get(`${chatId}-open`) !== currentDate) {
                reminderSent.set(`${chatId}-open`, currentDate);            
                await delay(5000); 
                await sock.sendMessage(chatId, {
                    text: "*( P E R I N G A T A N )*\n<~> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴅɪʙᴜᴋᴀ ᴅᴀʟᴀᴍ 5 ᴍᴇɴɪᴛ <~>"
                });
            }

            // Menutup Grup Jika Waktunya
            if (currentTime === close && groupStatus.get(chatId) !== "closed") {
                reminderSent.delete(`${chatId}-close`);            
                await delay(5000);            
                await sock.groupSettingUpdate(chatId, "announcement");
                groupStatus.set(chatId, "closed");
                await sock.sendMessage(chatId, {
                    text: `*( A U T O M A T I C )*\n<~> ɢʀᴏᴜᴘ ᴛᴇʟᴀʜ ᴅɪᴛᴜᴛᴜᴘ ᴅᴀɴ ᴀᴋᴀɴ ᴅɪʙᴜᴋᴀ ᴋᴇᴍʙᴀʟɪ ᴘᴜᴋᴜʟ ${open} ᴡɪʙ <~>`
                });
            }

            // Membuka Grup Jika Waktunya
            if (currentTime === open && groupStatus.get(chatId) !== "opened") {
                reminderSent.delete(`${chatId}-open`);            
                await delay(5000);           
                await sock.groupSettingUpdate(chatId, "not_announcement");
                groupStatus.set(chatId, "opened");
                await sock.sendMessage(chatId, {
                    text: `( *A U T O M A T I C )*\n<~> ɢʀᴏᴜᴘ ᴛᴇʟᴀʜ ʙᴜᴋᴀ ᴅᴀɴ ᴀᴋᴀɴ ᴅɪᴛᴜᴛᴜᴘ ᴋᴇᴍʙᴀʟɪ ᴘᴜᴋᴜʟ ${close} ᴡɪʙ <~>`
                });
            }
        } catch (error) {
            console.error(`Gagal mengatur grup ${chatId}:`, error);
        }
    }
});
schedule.scheduleJob("0 0 * * *", async () => {
    try {
        for (const chatId of Object.keys(store.groupMetadata)) {
            if (db.list().group[chatId] && db.list().group[chatId].totalpesan) {
                db.list().group[chatId].totalpesan = {};
            }
        }
        console.log("[LOG] Total pesan di semua grup telah direset pada pukul 00:00.");
    } catch (error) {
        console.error("Gagal mereset total pesan:", error);
    }
});
schedule.scheduleJob("* * * * *", async () => {
    let time = moment().tz(config.tz).format("HH:mm");
    if (db.list().settings.resetlimit === time) {
        for (let user in db.list().user) {
            if (db.list().user[user].limit < 10) {
                db.list().user[user].limit = 100;
            }
        }

        let message = `*– 乂 Reset Limit*\n> - *Limit Free:* 100/day\n\nReset berhasil! Upgrade ke premium untuk batas tak terbatas!`;
        for (let chatId of Object.keys(store.groupMetadata)) {
            await delay(2500);
            sock.sendMessage(chatId, {
                text: message
            });
        }
    }
});
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files system.js");
    delete require.cache[file];
});