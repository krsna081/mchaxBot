// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

let neko = async (m, {
    sock,
    Func,
    Scraper,
    text
}) => {
    if (!text) throw "> *❌ Masukkan query atau link dari Pinterest!*";

    if (Func.isUrl(text)) {
        if (!/pinterest.com|pin.it/.test(text))
            throw "> *❌ Masukkan link Pinterest yang valid!*";

        let puqi = await axios.get("https://api.siputzx.my.id/api/d/pinterest?url=" + text);
        let data = puqi.data.data;
        let cap = `*– 乂 Pinterest - Downloader 📌*\n${Object.entries(data)
            .map(([a, b]) => `> *🔹 ${a.capitalize()} :* ${b}`)
            .join("\n")}`

        return sock.sendFile(m.cht, data.url, null, cap, m);
    }

    let puqi = await axios.get("https://api.siputzx.my.id/api/s/pinterest?query=" + text);
    let data = puqi.data.data;
    if (!data.length) throw "> *❌ Tidak ditemukan hasil pencarian!*";

    let match = text.match(/--(\d+)$/);
    let count = match ? Math.min(parseInt(match[1]), 10) : 1;

    let shuffledResults = data.sort(() => Math.random() - 0.5);
    let albumResults = shuffledResults.slice(0, 5);
    let privateResults = shuffledResults.slice(0, count);

    let formattedResults = albumResults.map(result => ({
        image: {
            url: result.images_url
        },
        caption: `*– 乂 Pinterest - Pencarian 🔍*\n${Object.entries(result)
            .map(([a, b]) => `> *🔹 ${a.capitalize()} :* ${b}`)
            .join("\n")}`
    }));

    if (m.isGroup) {
        await sock.sendAlbumMessage(m.cht, formattedResults, {
            quoted: m,
            delay: 1000
        });
    } else {
        for (let item of privateResults) {
            let caption = `*– 乂 Pinterest - Pencarian 🔍*\n${Object.entries(item)
                .map(([a, b]) => `> *🔹 ${a.capitalize()} :* ${b}`)
                .join("\n")}`;
            await sock.sendFile(m.cht, item.images_url, null, caption, m);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

neko.command = "pinterest";
neko.alias = ["pin", "pindl"];
neko.category = ["downloader", "tools"];
neko.settings = {
    limit: true
};
neko.description = "🔎 Mencari atau mengunduh media dari Pinterest!";
neko.loading = true;

module.exports = neko;