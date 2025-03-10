// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

async function spotifyCreds() {
    try {
        const {
            data
        } = await axios.post(
            "https://accounts.spotify.com/api/token",
            "grant_type=client_credentials", {
                headers: {
                    Authorization: "Basic " +
                        Buffer.from("4c4fc8c3496243cbba99b39826e2841f:d598f89aba0946e2b85fb8aefa9ae4c8").toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        if (!data.access_token) throw new Error("Can't generate token!");
        return {
            status: true,
            data
        };
    } catch (e) {
        return {
            status: false,
            msg: e.message
        };
    }
}

function convert(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

class Spotify {
    detail = async (url) => {
        try {
            const creds = await spotifyCreds();
            if (!creds.status) return creds;

            const trackId = url.split("track/")[1]?.split("?")[0]; // Tambahkan validasi
            if (!trackId) throw new Error("Invalid Spotify URL");

            const {
                data
            } = await axios.get(
                `https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: "Bearer " + creds.data.access_token,
                    },
                }
            );

            return {
                status: true,
                thumbnail: data.album.images[0]?.url,
                title: `${data.artists[0]?.name} - ${data.name}`,
                artist: data.artists.map((a) => a.name).join(", "),
                duration: convert(data.duration_ms),
                preview: data.preview_url || "No preview available",
            };
        } catch (e) {
            return {
                status: false,
                msg: e.message
            };
        }
    };
    search = async (query, type = "track", limit = 20) => {
        try {
            const creds = await spotifyCreds();
            if (!creds.status) return creds;

            const {
                data
            } = await axios.get(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`, {
                    headers: {
                        Authorization: "Bearer " + creds.data.access_token,
                    },
                }
            );

            if (!data.tracks?.items.length)
                return {
                    status: false,
                    msg: "Music not found!"
                };

            return {
                status: true,
                data: data.tracks.items.map((v) => ({
                    title: `${v.album.artists[0]?.name} - ${v.name}`,
                    duration: convert(v.duration_ms),
                    popularity: `${v.popularity}%`,
                    preview: v.preview_url || "No preview available",
                    url: v.external_urls.spotify,
                })),
            };
        } catch (e) {
            return {
                status: false,
                msg: e.message
            };
        }
    };
    download = async (url) => {
        try {
            const {
                data: yanzz
            } = await axios.get(
                `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`, {
                    headers: {
                        accept: "application/json"
                    }
                }
            );

            if (!yanzz.result) throw new Error("Failed to fetch download link");

            const {
                data: yanz
            } = await axios.get(
                `https://api.fabdl.com/spotify/mp3-convert-task/${yanzz.result.gid}/${yanzz.result.id}`, {
                    headers: {
                        accept: "application/json"
                    }
                }
            );

            return {
                status: true,
                title: yanzz.result.name,
                type: yanzz.result.type,
                artist: yanzz.result.artists,
                duration: convert(yanzz.result.duration_ms),
                image: yanzz.result.image,
                download: "https://api.fabdl.com" + yanz.result.download_url,
            };
        } catch (error) {
            return {
                status: false,
                msg: error.message
            };
        }
    }
}

module.exports = new Spotify();