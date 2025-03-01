async function transcribe(url) {
    try {
        let res = await axios.get('https://yts.kooska.xyz/', {
            params: {
                url: url
            },
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://kooska.xyz/'
            }
        }).then(i => i.data)
        return {
            status: true,
            video_id: res.video_id,
            summarize: res.ai_response,
            transcript: res.transcript
        }
    } catch (e) {
        return {
            status: false,
            msg: `Gagal mendapatkan respon, dengan pesan: ${e.message}`
        }
    }
}

module.exports = {
    command: "transcribe",
    alias: [],
    category: ["tools"],
    settings: {
        limit: true
    },
    description: "Membuat transcribe dari video YouTube menggunakan url!",
    loading: true,
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        if (!text) return m.reply("Harap masukan link video YouTube untuk di transkripsi!");
        if (Func.isUrl(text) && /youtube./.test(text)) {
            try {
                m.reply("Sedang membuat ringkasan !");
                const result = await transcribe(text);
                if (!result.status) return m.reply(`❌ Error: ${result.msg}`);
                let cap = `*Transkripsi dan Ringkasan Youtube*\n\n*– 乂 Ringkasan Ai :*\n${result.summarize}\n\n*– 乂 Transkripsi Penuh :*\n${result.transcript}`
                m.reply(cap);
            } catch (err) {
                throw err;
            }
        }
    },
}