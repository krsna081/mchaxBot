const cron = require("node-cron");
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
    const groupStatus = {};
    const reminderSent = {};
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
        if (groups.antibot && m.isBot) {
            if (!m.isBotAdmin || m.isAdmin) return;
            m.reply(`*– 乂 Anti Bot - Detector*
Maaf, bot lain tidak diperbolehkan dalam grup ini!

*– 乂 Metadata Info:*
> - *Jenis:* ${m.type}
> - *isBaileys:* ${m.isBaileys}
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
            if (!groups.antitag) return;
            if (!m.isBotAdmin || m.isAdmin) return;

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
        if (groups.antinsfw && mime) {
            if (!m.isBotAdmin || m.isAdmin) return;
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
    let tes = await Analyze(m.body);
    let num = parseFloat((100 * tes.toxicity).toFixed(2));
    if (m.isGroup) {
        if (m.isAdmin || !m.isBotAdmin) return;
        if (groups.antitoxic && tes) {
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
        if (groups.antilink && isGroupLink) {
            if (!m.isBotAdmin || m.isAdmin) return;

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

    cron.schedule("* * * * *", async () => {
        const currentTime = moment().tz(config.tz).format("HH:mm");
        const currentDate = moment().tz(config.tz).format("YYYY-MM-DD");

        for (const chatId in db.list().gcauto) {
            try {
                const {
                    close,
                    open
                } = db.list().gcauto[chatId];
                const closeReminderTime = moment(close, "HH:mm").subtract(5, "minutes").format("HH:mm");
                const openReminderTime = moment(open, "HH:mm").subtract(5, "minutes").format("HH:mm");

                if (currentTime === closeReminderTime) {
                    if (reminderSent[`${chatId}-close`] !== currentDate) {
                        reminderSent[`${chatId}-close`] = currentDate;
                        await sock.sendMessage(chatId, {
                            text: "*( P E R I N G A T A N )*\n<~> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴅɪᴛᴜᴛᴜᴘ ᴅᴀʟᴀᴍ 5 ᴍᴇɴɪᴛ <~>"
                        });
                        await delay(2500);
                    }
                }

                if (currentTime === openReminderTime) {
                    if (reminderSent[`${chatId}-open`] !== currentDate) {
                        reminderSent[`${chatId}-open`] = currentDate;
                        await sock.sendMessage(chatId, {
                            text: "*( P E R I N G A T A N )*\n<~> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴅɪʙᴜᴋᴀ ᴅᴀʟᴀᴍ 5 ᴍᴇɴɪᴛ <~>"
                        });
                        await delay(2500);
                    }
                }

                if (currentTime === close && groupStatus[chatId] !== "closed") {
                    await sock.groupSettingUpdate(chatId, "announcement");
                    groupStatus[chatId] = "closed";
                    await sock.sendMessage(chatId, {
                        text: `*( A U T O M A T I C )*\n<~> ɢʀᴏᴜᴘ ᴛᴇʟᴀʜ ᴅɪᴛᴜᴛᴜᴘ ᴅᴀɴ ᴀᴋᴀɴ ᴅɪʙᴜᴋᴀ ᴋᴇᴍʙᴀʟɪ ᴘᴜᴋᴜʟ ${open} ᴡɪʙ <~>`
                    });
                    reminderSent[`${chatId}-close`] = "";
                    await delay(2500);
                }

                if (currentTime === open && groupStatus[chatId] !== "opened") {
                    await sock.groupSettingUpdate(chatId, "not_announcement");
                    groupStatus[chatId] = "opened";
                    await sock.sendMessage(chatId, {
                        text: `( *A U T O M A T I C )*\n<~> ɢʀᴏᴜᴘ ᴛᴇʟᴀʜ ʙᴜᴋᴀ ᴅᴀɴ ᴀᴋᴀɴ ᴅɪᴛᴜᴛᴜᴘ ᴋᴇᴍʙᴀʟɪ ᴘᴜᴋᴜʟ ${close} ᴡɪʙ <~>`
                    });
                    reminderSent[`${chatId}-open`] = "";
                    await delay(2500);
                }
            } catch (error) {
                console.error(`Gagal mengatur grup ${chatId}:`, error);
            }
        }
    });
    cron.schedule("* * * * *", async () => {
        const currentTime = moment().tz(config.tz).format("HH:mm");
        const currentDate = moment().tz(config.tz).format("YYYY-MM-DD");

        for (const chatId of Object.keys(store.groupMetadata)) {
            try {
                const bukaPuasa = "18:18";
                const reminderTime = moment(bukaPuasa, "HH:mm").subtract(5, "minutes").format("HH:mm");

                if (!sentMessages[chatId] || sentMessages[chatId].date !== currentDate) {
                    sentMessages[chatId] = {
                        reminder: false,
                        buka: false,
                        date: currentDate
                    };
                }

                if (currentTime === reminderTime && !sentMessages[chatId].reminder) {
                    sock.sendMessage(chatId, {
                        text: "*( P E R I N G A T A N )*\n<~> ᴡᴀᴋᴛᴜ ʙᴜᴋᴀ ᴘᴜᴀꜱᴀ ᴛɪɴɢɢᴀʟ 5 ᴍᴇɴɪᴛ ʟᴀɢɪ! ꜱɪᴀᴘᴋᴀɴ ᴛᴀᴊɪʟ ᴅᴀɴ ᴍɪɴᴜᴍᴀɴ ʏᴀ! <~>",
                        contextInfo: {
                            externalAdReply: {
                                title: Func.Styles("berbuka puasa inggal 5 menit untuk wilayah wib"),
                                thumbnailUrl: "https://files.catbox.moe/n56uvp.jpg",
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                showAdAttribution: true
                            }
                        }
                    }).then((res) => {
                        sock.sendMessage(chatId, {
                            audio: {
                                url: "https://files.catbox.moe/o76ma6.webm"
                            },
                            mimetype: "audio/mp4",
                        }, {
                            quoted: res
                        })
                    })
                    sentMessages[chatId].reminder = true;
                    await delay(2500);
                }

                if (currentTime === bukaPuasa && !sentMessages[chatId].buka) {
                    await sock.sendMessage(chatId, {
                        text: "*( I N F O R M A S I )*\n<~> ᴀʟʜᴀᴍᴅᴜʟɪʟʟᴀʜ, ᴡᴀᴋᴛᴜɴʏᴀ ʙᴜᴋᴀ ᴘᴜᴀꜱᴀ! ꜱᴇʟᴀᴍᴀᴛ ᴍᴇɴɪᴋᴍᴀᴛɪ ꜱᴀɴᴛᴀᴘᴀɴ ꜱᴇʀᴛᴀ ꜱᴇᴍᴏɢᴀ ᴀᴍᴀʟ ɪʙᴀᴅᴀʜ ᴋɪᴛᴀ ᴅɪᴛᴇʀɪᴍᴀ ᴏʟᴇʜ ᴀʟʟᴀʜ ꜱᴡᴛ <~>"
                    });
                    sentMessages[chatId].buka = true;
                    await delay(2500);
                }
            } catch (error) {
                console.error(`Gagal mengirim info buka puasa ke grup ${chatId}:`, error);
            }
        }
    });
    cron.schedule("0 0 * * *", () => {
        console.log("🔄 Reset total pesan grup...");
        for (let grp in Object.keys(store.groupMetadata)) {
            if (db.list().group[grp].totalpesan) {
                db.list().group[grp].totalpesan = {};
                db.list().group[grp].lastReset = Date.now();
            }
        }
        console.log("✅ Reset selesai.");
    }, {
        timezone: config.tz
    });
    cron.schedule("* * * * *", () => {
        let time = moment().tz(config.tz).format("HH:mm");
        if (db.list().settings.resetlimit === time) {
            for (let user in db.list().user) {
                if (db.list().user[user].limit < 10) {
                    db.list().user[user].limit = 100;
                }
            }

            let message = `*– 乂 Reset Limit*\n> - *Limit Free:* 100/day\n\nReset berhasil! Upgrade ke premium untuk batas tak terbatas!`;
            for (let chatId of Object.keys(store.groupMetadata)) {
                sock.sendMessage(chatId, {
                    text: message
                });
            }
        }
    });
};