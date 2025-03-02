const yts = require("yt-search");

module.exports = {
    command: "yt2",
    alias: ["yt2"],
    category: ["downloader"],
    settings: {
        limit: true
    },
    description: "Mendownload video atau audio dari YouTube",
    async run(m, {
        sock,
        text,
        config
    }) {
        if (!text) return m.reply(`╭──[❌ *Masukkan Input yang Valid* ]
᎒⊸ Masukkan link YouTube atau cari video berdasarkan query.
᎒⊸ Contoh: *${m.prefix}yt2 Lathi* atau *${m.prefix}yt2 https://youtu.be/abc123 1080p*
╰────────────•`);

        let isUrl = text.startsWith("http");
        let words = text.split(" ");
        let possibleQuality = words[words.length - 1]; // Kata terakhir (cek apakah resolusi/bitrate)
        let quality = null;

        if (/^\d+p$/i.test(possibleQuality)) {
            quality = possibleQuality.replace("p", "");
            words.pop();
        } else if (/^\d+kbps$/i.test(possibleQuality)) {
            quality = possibleQuality.replace("kbps", "");
            words.pop();
        }

        let query = words.join(" ");
        let videoUrl = isUrl ? query : null;

        if (!isUrl) {
            let search = await yts(query);
            if (!search.videos.length) return m.reply("❌ Video tidak ditemukan!");
            videoUrl = search.videos[0].url; // Ambil video teratas
        }

        let response = await axios.get(`https://ytdownloader.nvlgroup.my.id/info?url=${videoUrl}`);
        let data = await response.data;
        if (!data.title) return m.reply("❌ Video tidak ditemukan!");

        let infoMessage = `╭──[🎵 *YouTube - Downloader* ]\n` +
            `᎒⊸ *📌 Judul:* ${data.title}\n` +
            `᎒⊸ *📺 Channel:* ${data.uploader}\n` +
            `᎒⊸ *⏳ Durasi:* ${data.duration}\n` +
            `╰────────────•`;

        if (!quality) {
            let videoOptions = data.resolutions.map(v => ({
                title: `📹 ${v.height}p (${v.size})`,
                command: `${m.prefix}yt2 ${videoUrl} ${v.height}p`,
            }));

            let audioOptions = data.audioBitrates.map(a => ({
                title: `🎵 ${a.bitrate}kbps (${a.size})`,
                command: `${m.prefix}yt2 ${videoUrl} ${a.bitrate}kbps`,
            }));

            let sections = [{
                type: "list",
                title: "Pilih Opsi",
                value: [{
                        headers: "📹 Pilih Resolusi Video",
                        rows: videoOptions,
                    },
                    {
                        headers: "🎵 Pilih Bitrate Audio",
                        rows: audioOptions,
                    },
                ]
            }]

            return sock.sendButton(m.cht, sections, m, {
                image: {
                    url: data.thumbnail
                },
                caption: infoMessage,
                footer: config.name,
            })
        }

        let isAudio = !isNaN(quality) && text.includes("kbps");
        let downloadUrl = isAudio ?
            `https://ytdownloader.nvlgroup.my.id/audio?url=${videoUrl}&bitrate=${quality}` :
            `https://ytdownloader.nvlgroup.my.id/download?url=${videoUrl}&resolution=${quality}`;

        let fileType = isAudio ? "audio/mpeg" : "video/mp4";
        let fileName = `${data.title}.${isAudio ? "mp3" : "mp4"}`;
        let fileSize = isAudio ?
            data.audioBitrates.find(a => a.bitrate == quality)?.size.replace(" MB", "") :
            data.resolutions.find(v => v.height == quality)?.size.replace(" MB", "");

        fileSize = parseFloat(fileSize) || 0;
        let sendAsDocument = fileSize > 10;

        return sock.sendMessage(m.cht, sendAsDocument ?
            {
                document: {
                    url: downloadUrl
                },
                mimetype: fileType,
                fileName,
            } :
            isAudio ?
            {
                audio: {
                    url: downloadUrl
                },
                mimetype: "audio/mpeg",
                contextInfo: {
                    externalAdReply: {
                        mediaUrl: videoUrl,
                        mediaType: 2,
                        title: data.title,
                        body: "YouTube Audio",
                        thumbnailUrl: data.thumbnail,
                        sourceUrl: videoUrl,
                        renderLargerThumbnail: true,
                    },
                },
            } :
            {
                video: {
                    url: downloadUrl
                },
                mimetype: "video/mp4",
                contextInfo: {
                    externalAdReply: {
                        mediaUrl: videoUrl,
                        mediaType: 2,
                        title: data.title,
                        body: "YouTube Video",
                        thumbnailUrl: data.thumbnail,
                        sourceUrl: videoUrl,
                        renderLargerThumbnail: true,
                    },
                },
            }, {
                quoted: m
            });
    },
};