// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

async function events(m, {
    sock,
    Func
}) {
    sock.turnme = sock.turnme || {};
    if (!sock.turnme[m.sender]) return;
    if (!m.body.match(/^[a-z_]+$/)) return;

    const {
        imageUrl,
        type
    } = sock.turnme[m.sender];
    let selectedOption = m.body.trim();
    delete sock.turnme[m.sender];

    if (!imageUrl) return m.reply("❌ Gagal mendapatkan URL gambar, coba lagi.");
    if (!selectedOption) return m.reply("❌ Anda belum memilih opsi!");

    const options = {
        method: "POST",
        url: type === "expression" ? "https://api.lovita.io/turnMe/expression" :
            type === "transform" ? "https://api.lovita.io/turnMe/transform" :
            "https://api.lovita.io/turnMe/age",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Func.random([
                "Rk-865398da3e89a11620187a01de45b5e2",
                "Rk-05e7472153248f91ee66da16fb2383a2"
            ]),
        },
        data: type === "age" ? {
                init_image: imageUrl,
                age: selectedOption
            } :
            type === "expression" ? {
                init_image: imageUrl,
                expression: selectedOption
            } :
            {
                init_image: imageUrl,
                style_id: selectedOption,
                num_image: 1
            },
    };

    console.log("🔍 Debugging API Request:", JSON.stringify(options, null, 2));

    try {
        const response = await axios.request(options);
        if (response.data.status && response.data.result?.images?.length) {
            const resultUrl = response.data.result.images[0];
            await sock.sendMessage(m.cht, {
                image: {
                    url: resultUrl
                },
                caption: `✅ Berhasil diproses dengan gaya: *${selectedOption}*`,
            }, {
                quoted: m
            });
        } else {
            m.reply("❌ Gagal memproses gambar. Silakan coba lagi.");
        }
    } catch (err) {
        console.error("❌ Error processing image:", err.response?.data || err.message);
        m.reply("⚠️ Terjadi kesalahan saat memproses gambar. Coba lagi nanti.");
    }
}

module.exports = {
    events,
};