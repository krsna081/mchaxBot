// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

let deku = async (m, {
    sock,
    Func,
    Scraper,
    text,
    config
}) => {

    if (!/x.com/.test(text)) throw '⚠️ Mana Link Twitter Nya!';

    // Gagal get video/image
    const tw = await Scraper.twitter(text);
    if (!tw || (!tw.images.length && !tw.videos.length)) return m.reply('Error Kabeh Gada Link Vt Nya 😂');

    // image
    if (tw.type === "image") {
        const ftmap = tw.images.map(x => x.download);
        let medias = [];
        for (let i = 0; i < ftmap.length; i++) {
            medias.push({
                image: {
                    url: ftmap[i]
                },
                caption: `> Media: ${i + 1}`,
            });
        }

        sock.sendAlbumMessage(m.cht, medias, {
            delay: 1500,
            quoted: m
        });
    } else if (tw.type === "video") {
        const x = tw.videos[0].download;
        await sock.sendMessage(m.cht, {
            video: {
                url: x
            },
            caption: '> Done wok 😹'
        }, {
            quoted: m
        });
    }
}

deku.command = "twitter"
deku.alias = [
    "tw",
    "twdl",
    "xdl",
    "x"
]
deku.category = [
    "downloader"
]
deku.settings = {
    limit: true
}
deku.loading = true

module.exports = deku