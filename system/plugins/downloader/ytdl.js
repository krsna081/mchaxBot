const axios = require("axios");
const yts = require("yt-search");

module.exports = {
    command: "yt2",
    alias: [],
    category: ["downloader"],
    settings: { limit: true },
    description: "Mendownload video atau audio dari YouTube",
    async run(m, { sock, text, config }) {
        sock.yt2 = sock.yt2 || {};

        let isAudio = text.includes("--audio");
        let isVideo = text.includes("--video");

        // Menghapus flag --audio atau --video dari text
        text = text.replace("--audio", "").replace("--video", "").trim();

        let videoUrl;
        let videoData;

        if (sock.yt2[m.sender] && sock.yt2[m.sender].url && text === sock.yt2[m.sender].url) {
            // Jika pengguna menekan tombol, gunakan URL yang sudah ada
            videoUrl = sock.yt2[m.sender].url;
            videoData = sock.yt2[m.sender].metadata;
        } else if (text.startsWith("http")) {
            // Jika input adalah URL langsung
            videoUrl = text;
        } else {
            // Jika input adalah pencarian
            let search = await yts(text);
            if (!search.videos.length) return m.reply("❌ Video tidak ditemukan!");
            let result = search.videos[0];
            videoUrl = result.url;
            videoData = {
                title: result.title,
                author: result.author.name,
                duration: result.timestamp,
                thumb: result.thumbnail,
            };

            // Simpan URL dan metadata
            sock.yt2[m.sender] = { url: videoUrl, metadata: videoData };
        }

        let apiUrl = isAudio
            ? `https://rest.cloudkuimages.xyz/api/download/ytmp3?url=${videoUrl}`
            : `https://rest.cloudkuimages.xyz/api/download/ytmp4?url=${videoUrl}`;

        let response = await axios.get(apiUrl);
        let { download_url } = response.data;

        // Fungsi untuk mendapatkan ukuran file manual
        async function getFileSize(url) {
            try {
                let res = await axios.head(url);
                return res.headers['content-length'] ? parseInt(res.headers['content-length'], 10) : 0;
            } catch {
                return 0;
            }
        }

        let fileSize = await getFileSize(download_url);
        let sizeText = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) + " MB" : "Tidak diketahui";

        let infoMessage = `╭──[🎵 *YouTube - Downloader* ]\n` +
            `᎒⊸ *Judul*: ${videoData?.title || "Tidak diketahui"}\n` +
            `᎒⊸ *Author*: ${videoData?.author || "Tidak diketahui"}\n` +
            `᎒⊸ *Durasi*: ${videoData?.duration || "Tidak diketahui"}\n` +
            `᎒⊸ *Ukuran*: ${sizeText}\n` +
            `᎒⊸ *Link*: ${videoUrl}\n` +
            `╰────────────•`;

        if (!isAudio && !isVideo) {
            return sock.sendMessage(m.cht, {
                image: { url: videoData?.thumb || "https://i.imgur.com/YQJX5sG.png" },
                caption: infoMessage,
                footer: config.name,
                buttons: [
                    { buttonId: `.yt2 ${videoUrl} --audio`, buttonText: { displayText: "🎵 Download Audio" }, type: 1 },
                    { buttonId: `.yt2 ${videoUrl} --video`, buttonText: { displayText: "📹 Download Video" }, type: 1 },
                ],
                headerType: 4,
                viewOnce: true,
            }, { quoted: m });
        }

        if (fileSize > 10 * 1024 * 1024) {
            return sock.sendMessage(m.cht, {
                document: { url: download_url },
                mimetype: isAudio ? "audio/mpeg" : "video/mp4",
                fileName: `${videoData?.title || "video"}.${isAudio ? "mp3" : "mp4"}`,
            }, { quoted: m });
        } else {
            return sock.sendMessage(m.cht, {
                [isAudio ? "audio" : "video"]: { url: download_url },
                mimetype: isAudio ? "audio/mpeg" : "video/mp4",
                contextInfo: {
                    externalAdReply: {
                        mediaUrl: videoUrl,
                        mediaType: 2,
                        title: videoData?.title || "YouTube Video",
                        body: "YouTube Downloader",
                        thumbnailUrl: videoData?.thumb || "https://i.imgur.com/YQJX5sG.png",
                        sourceUrl: videoUrl,
                        renderLargerThumbnail: true,
                    },
                },
            }, { quoted: m });
        }

        setTimeout(() => delete sock.yt2[m.sender], 60000);
    },
};