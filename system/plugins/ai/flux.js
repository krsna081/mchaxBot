module.exports = {
    command: "flux",
    alias: [],
    category: ["ai"],
    settings: { limit: true },
    description: "🖼️ Membuat text menjadi gambar flux",
    loading: true,
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
        if (!text) throw `> *Mohon masukkan prompt untuk membuat gambar!*`;

        const match = text.match(/--(\d+)$/);
        let totalImages = match ? parseInt(match[1]) : 1;
        if (totalImages > 10) return m.reply('Maksimum 10 request');

        const prompt = match ? text.replace(match[0], '').trim() : text.trim();
        if (!prompt) throw `> ❌ *Prompt tidak valid!*`;

        let allImages = [];

        try {
            for (let i = 0; i < totalImages; i++) {
                let data = await flux(prompt);
                if (Array.isArray(data) && data[0]?.url) {
                    allImages.push(data[0].url);
                } else {
                    throw new Error('Respons tidak valid dari fungsi flux');
                }
            }

            m.reply(`> ✍️ *Prompt:* ${prompt}`);

            if (allImages.length > 1) {
                let album = allImages.map(url => ({
                    image: { url },
                    caption: null
                }));

                await sock.sendAlbumMessage(m.cht, album, { quoted: m, delay: 1000 });
            } else {
                await sock.sendMessage(m.cht, {
                    image: { url: allImages[0] }
                }, { quoted: m });
            }
        } catch (error) {
            throw error;
        }
    }
};

// Fungsi flux untuk permintaan ke API
async function flux(prompt) {
    try {
        const postResponse = await fetch('https://christianhappy-flux-1-schnell.hf.space/call/infer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [prompt, 0, true, 800, 800, 1]
            })
        });

        if (!postResponse.ok) throw new Error('POST request failed');

        const { event_id: eventId } = await postResponse.json();
        let result = null;
        let retries = 0;
        const maxRetries = 10;

        while (!result && retries < maxRetries) {
            const getResponse = await fetch(`https://christianhappy-flux-1-schnell.hf.space/call/infer/${eventId}`);
            if (getResponse.ok) {
                result = await getResponse.text();
            }
            if (!result) {
                retries++;
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        if (!result) throw new Error('Gagal mengambil hasil');

        let textData = result;
        let lines = textData.split('\n');
        let jsonData = null;

        for (let line of lines) {
            if (line.startsWith('data:')) {
                jsonData = JSON.parse(line.substring(6));
                break;
            }
        }
        return jsonData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}