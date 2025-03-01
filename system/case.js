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
    switch (m.command) {
    case "beautify": {
        if (!quoted.text) return m.reply("Masukan kode untuk dirapikan!");
        try {
           let data = require("js-beautify")(quoted.text);
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
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files case.js");
    delete require.cache[file];
});