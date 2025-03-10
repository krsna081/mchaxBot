//© Bentala - Bot
// • Credits : wa.me/6282258713880 [ Renjana ]
// • Owner: 6282258713880

/*
• Telegram: Renjana_ex
• Instagram: Renjana.ex
*/

const {
    execSync
} = require("child_process");
const {
    fromBuffer
} = require("file-type");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const {
    writeExif
} = require(process.cwd() + "/lib/sticker.js");

const containsEmoji = (text) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2764}\u{1F49C}\u{1F5A4}]/gu;
    return emojiRegex.test(text);
};

module.exports = {
    command: "furbrat",
    alias: ["hikagen"],
    category: ["tools"],
    settings: {
        limit: true
    },
    description: "🐾 Membuat Brat versi furry :v",
    async run(m, {
        sock,
        text,
        Func,
        config
    }) {
        let style = 1;
        if (containsEmoji(text)) {
            return m.reply('⚠️ Oops! Teks yang kamu gunakan mengandung emoji, yang nggak bisa diproses untuk stiker, gambar, atau animasi.');
        }

        const idMatch = m.args.find((arg) => arg.startsWith("--id="));
        if (idMatch) {
            const idValue = parseInt(idMatch.split("=")[1]);
            if (!isNaN(idValue) && idValue >= 1 && idValue <= 7) style = idValue;
        }

        const isSticker = m.args.includes("--sticker");
        const isAnimated = m.args.includes("--animated");
        const prompt = text.replace(/--\w+(\=\w+)?/g, "").trim();

        if (!prompt)
            return m.reply(`⚠️ Masukkan teksnya! Misalnya:\n*.furbrat Halo Dunia --id=3 --sticker*\n\nOpsi yang bisa kamu pilih:\n- *--id=<angka>*: Pilih style (1-7, default: 1).\n- *--sticker*: Hasilnya jadi stiker.\n- *--animated*: Buat stiker animasi.`);

        const apiUrl = new URL("https://fastrestapis.fasturl.link/tool/furbrat");
        apiUrl.searchParams.append("text", prompt);
        apiUrl.searchParams.append("style", style);
        apiUrl.searchParams.append("mode", "center");

        try {
            m.reply(`⏳ Mohon tunggu, ${isAnimated ? "stiker animasi" : "gambar"} sedang dibuat...`);

            const {
                data
            } = await axios.get(apiUrl.toString(), {
                responseType: "arraybuffer"
            });

            if (isAnimated) {
                return await createAnimatedSticker(m, prompt, style, config);
            }

            if (isSticker) {
                return await sendSticker(m, data, config);
            }

            await sock.sendFile(m.cht, data, "image.png", "Berikut hasilnya.", m);
        } catch (error) {
            console.error(error);
            m.reply("❌ Terjadi kesalahan saat membuat gambar.");
        }
    },
};

// **Fungsi untuk membuat stiker animasi**
async function createAnimatedSticker(m, prompt, style, config) {
    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const framePaths = [];
    const words = prompt.split(" ");

    for (let i = 0; i <= words.length; i++) {
        const frameText = words.slice(0, i + 1).join(" ");
        const frameUrl = new URL("https://fastrestapis.fasturl.link/tool/furbrat");
        frameUrl.searchParams.append("text", frameText);
        frameUrl.searchParams.append("style", style);
        frameUrl.searchParams.append("mode", "center");

        const {
            data
        } = await axios.get(frameUrl.toString(), {
            responseType: "arraybuffer"
        });

        const framePath = path.join(tempDir, `frame${i}.mp4`);
        fs.writeFileSync(framePath, data);
        framePaths.push(framePath);
    }

    if (framePaths.length * 1 > 10) {
        m.reply("⚠️ Durasi animasi lebih dari 10 detik, proses dibatalkan!");
        framePaths.forEach(fs.unlinkSync);
        return;
    }

    const fileListPath = path.join(tempDir, "filelist.txt");
    fs.writeFileSync(fileListPath, framePaths.map(f => `file '${f}'\nduration 1`).join("\n"));

    const outputVideo = path.join(tempDir, "output.mp4");
    execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=1" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 10 ${outputVideo}`);

    const outputSticker = path.join(tempDir, "output.webp");
    execSync(`ffmpeg -i ${outputVideo} -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease" -c:v libwebp -lossless 1 -qscale 90 -preset default -loop 0 -an -vsync 0 -s 512x512 ${outputSticker}`);

    const stickerBuffer = fs.readFileSync(outputSticker);
    if (stickerBuffer.length / 1024 / 1024 > 1) {
        m.reply("⚠️ Ukuran stiker lebih dari 1MB, coba gambar lebih kecil.");
    } else {
        await sendSticker(m, stickerBuffer, config);
    }

    framePaths.forEach(fs.unlinkSync);
    fs.unlinkSync(fileListPath);
    fs.unlinkSync(outputVideo);
    fs.unlinkSync(outputSticker);
}

// **Fungsi untuk mengirim stiker**
async function sendSticker(m, buffer, config) {
    const metadata = await fromBuffer(buffer);
    const sticker = await writeExif({
        mimetype: metadata.mime,
        data: buffer
    }, {
        packName: config.sticker.packname,
        packPublish: config.sticker.author
    });
    m.reply({
        sticker
    });
}