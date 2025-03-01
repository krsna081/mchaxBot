let neko = async (m, { sock, Func, Scraper, text }) => {
    if (!text) throw "> *❌ Masukkan query atau link dari Pinterest!*";

    if (Func.isUrl(text)) {
        if (!/pinterest.com|pin.it/.test(text))
            throw "> *❌ Masukkan link Pinterest yang valid!*";

        let data = await Scraper.pinterest.download(text);
        let cap = "*– 乂 Pinterest - Downloader 📌*\n";
        cap += `> *🔹 Judul :* ${data.title}\n`;
        cap += `> *🔹 Kata Kunci :* ${data.keyword.join(", ")}\n`;
        cap += `> *🔹 Pengarang :* ${data.author.name}\n`;

        return sock.sendFile(m.cht, data.download, null, cap, m);
    }

    let data = await Scraper.pinterest.search(text);
    if (!data.length) throw "> *❌ Tidak ditemukan hasil pencarian!*";

    let match = text.match(/--(\d+)$/);
    let count = match ? Math.min(parseInt(match[1]), 10) : 1;
    
    let shuffledResults = data.sort(() => Math.random() - 0.5);
    let albumResults = shuffledResults.slice(0, 5);
    let privateResults = shuffledResults.slice(0, count);
    
    let formattedResults = albumResults.map(result => ({
        image: { url: result.image }, 
        caption: `*– 乂 Pinterest - Pencarian 🔍*\n${Object.entries(result)
            .map(([a, b]) => `> *🔹 ${a.capitalize()} :* ${b}`)
            .join("\n")}`
    }));

    if (m.isGroup) {
        await sock.sendAlbumMessage(m.cht, formattedResults, { quoted: m, delay: 1000 });
    } else {
        for (let item of privateResults) {
            let caption = `*– 乂 Pinterest - Pencarian 🔍*\n${Object.entries(item)
                .map(([a, b]) => `> *🔹 ${a.capitalize()} :* ${b}`)
                .join("\n")}`;
            await sock.sendFile(m.cht, item.image, null, caption, m);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

neko.command = "pinterest";
neko.alias = ["pin", "pindl"];
neko.category = ["downloader", "tools"];
neko.settings = { limit: true };
neko.description = "🔎 Mencari atau mengunduh media dari Pinterest!";
neko.loading = true;

module.exports = neko;