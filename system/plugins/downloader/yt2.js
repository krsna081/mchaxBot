const axios = require("axios");
const yts = require("yt-search");

module.exports = {
    command: "yt2",
    alias: [],
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
        sock.yt2 = sock.yt2 || {};

        if (!text) return m.reply(`╭──[❌ *Masukkan Input yang Valid* ]
᎒⊸ Ketik teks untuk mencari video YouTube, atau masukkan link YouTube yang valid.
᎒⊸ Contoh: *${m.prefix + m.command} Lathi* atau *${m.prefix + m.command} https://youtu.be/abc123*
╰────────────•`);

        let isAudio = text.includes("--audio");
        let isVideo = text.includes("--video");

        let videoUrl;
        let videoData = {};

        if (text.startsWith("http")) {
            let videoId = text.split("v=")[1] || text.split("/").pop();
            let search = await yts({
                videoId
            });

            if (!search || !search.title) return m.reply("❌ Video tidak ditemukan!");

            videoUrl = text;
            videoData = {
                title: search.title,
                author: search.author.name,
                duration: search.timestamp,
                thumb: search.thumbnail,
            };
        } else {
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
        }

        sock.yt2[m.sender] = {
            url: videoUrl
        };

        let apiUrl = isAudio ?
            `https://rest.cloudkuimages.xyz/api/download/ytmp3?url=${videoUrl}` :
            `https://rest.cloudkuimages.xyz/api/download/ytmp4?url=${videoUrl}`;

        async function fetchWithRetry(url, retries = 3) {
            for (let i = 0; i < retries; i++) {
                try {
                    let response = await axios.get(url, {
                        timeout: 10000
                    });
                    return response.data;
                } catch (error) {
                    if (i === retries - 1) throw error;
                }
            }
        }

        try {
            let response = await fetchWithRetry(apiUrl);
            let {
                metadata
            } = response;
            if (!metadata) throw new Error("❌ Gagal mendapatkan URL download!");

            if (!videoData.title) {
                videoData = {
                    title: response.metadata?.title || "Tidak diketahui",
                    author: response.metadata?.author || "Tidak diketahui",
                    duration: "Tidak diketahui",
                    thumb: `https://i.ytimg.com/vi/${videoUrl.split("v=")[1]}/hqdefault.jpg`,
                };
            }

            async function getFileSize(url) {
                try {
                    let res = await axios.head(url);
                    return res.headers['content-length'] ? parseInt(res.headers['content-length'], 10) : 0;
                } catch {
                    return 0;
                }
            }

            let fileSize = await getFileSize(metadata.download_url);
            let sizeText = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) + " MB" : "Tidak diketahui";

            let infoMessage = `╭──[🎵 *YouTube - Downloader* ]\n` +
                `᎒⊸ *Judul*: ${videoData.title}\n` +
                `᎒⊸ *Author*: ${videoData.author}\n` +
                `᎒⊸ *Durasi*: ${videoData.duration}\n` +
                `᎒⊸ *Ukuran*: ${sizeText}\n` +
                `᎒⊸ *Link*: ${videoUrl}\n` +
                `╰────────────•`;

            if (!isAudio && !isVideo) {
                return sock.sendMessage(m.cht, {
                    image: {
                        url: videoData.thumb
                    },
                    caption: infoMessage,
                    footer: config.name,
                    buttons: [{
                            buttonId: `.yt2 ${videoUrl} --audio`,
                            buttonText: {
                                displayText: "🎵 Download Audio"
                            },
                            type: 1
                        },
                        {
                            buttonId: `.yt2 ${videoUrl} --video`,
                            buttonText: {
                                displayText: "📹 Download Video"
                            },
                            type: 1
                        },
                    ],
                    headerType: 4,
                    viewOnce: true,
                }, {
                    quoted: m
                });
            }

            if (fileSize > 10 * 1024 * 1024) {
                return sock.sendMessage(m.cht, {
                    document: {
                        url: metadata.download_url
                    },
                    mimetype: isAudio ? "audio/mpeg" : "video/mp4",
                    fileName: `${videoData.title}.${isAudio ? "mp3" : "mp4"}`,
                }, {
                    quoted: m
                });
            } else {
                return sock.sendMessage(m.cht, {
                    [isAudio ? "audio" : "video"]: {
                        url: metadata.download_url
                    },
                    mimetype: isAudio ? "audio/mpeg" : "video/mp4",
                    contextInfo: {
                        externalAdReply: {
                            mediaUrl: videoUrl,
                            mediaType: 2,
                            title: videoData.title,
                            body: "YouTube Downloader",
                            thumbnailUrl: videoData.thumb,
                            sourceUrl: videoUrl,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: m
                });
            }

        } catch (err) {
            return m.reply(`❌ Terjadi kesalahan saat mengambil data: ${err.message}`);
        }

        setTimeout(() => delete sock.yt2[m.sender], 5000);
    },
};