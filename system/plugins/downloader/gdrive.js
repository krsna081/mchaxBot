class Command {
    constructor() {
        this.command = "gdrive";
        this.alias = ["googledrive"];
        this.category = ["downloader"];
        this.settings = {
            limit: true
        };
        this.description = "📁 Download file dari gdrive !";
        this.loading = true;
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        store,
        text
    }) => {
        if (!text || !Func.isUrl(text) || !/drive.google/.test(text)) throw "*❌ Input salah :* Masukan url sfileMobi !";
        let data = await Scraper.gdrive(text);;
        let caption = "*Goggle Drive - Downloader 📩*\n";
        caption += Object.entries(data).map(([a, b]) => `- ${a.capitalize()}: ${b}`).join("\n");
        caption += "\n\n*✅ Media Berhasil Diunduh !*\nNikmati kemudahan saat download apapun hanya di NekoBot!";
        sock.sendFile(m.cht, data.downloadUrl, data.fileName, caption, m, {
            mimetype: data.mimetype
        });
    };
}

module.exports = new Command();