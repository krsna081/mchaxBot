const axios = require("axios");

module.exports = {
    command: "turnme",
    alias: ["turnme"],
    category: ["ai"],
    settings: {
        premium: true
    },
    description: "Transform your image with AI effects",
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
        sock.turnme = sock.turnme || {};
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || "";

        if (!sock.turnme[m.sender]) {
            if (!mime.startsWith("image")) {
                return m.reply("> *– 乂 Penggunaan turnMe*\n\n1. Gunakan `--expression` untuk membuat expresi pada gambar\n2. Gunakan `--transform` untuk membuat gambar menjadi seperti anime & dll\n3. Gunakan `--age` untuk mengubah wajah gambar");
            }

            let buffer = await q.download();
            const imageUrl = await Uploader.catbox(buffer);

            sock.turnme[m.sender] = {
                imageUrl
            };
        }

        const args = text.split(" ");
        if (!args[0] || !args[0].startsWith("--")) {
            return m.reply("Gunakan format yang benar, contoh:\n• *turnme --expression*\n• *turnme --transform*\n• *turnme --age*");
        }

        const type = args[0].replace("--", "");
        if (!["expression", "transform", "age"].includes(type)) {
            return m.reply("Opsi tidak valid! Pilihan yang tersedia:\n• *expression*\n• *transform*\n• *age*");
        }

        sock.turnme[m.sender].type = type;

        const validOptions = await axios.get("https://api.lovita.io/turnMe/styles", {
            headers: {
                Authorization: "Bearer " + Func.random(["Rk-865398da3e89a11620187a01de45b5e2", "Rk-05e7472153248f91ee66da16fb2383a2"])
            },
        }).then(res => {
            const result = res.data.result;
            return type === "expression" ? result.expression :
                type === "transform" ? result.transform :
                result.age;
        }).catch(err => {
            console.error("Error fetching styles:", err.message);
            return [];
        });

        if (validOptions.length === 0) return m.reply(`Gagal mengambil daftar ${type}. Coba lagi nanti.`);

        if (!args[1]) {
           return await sock.sendMessage(m.cht, {
            poll: {
                name: `– 乂 Pilih salah satu opsi ${type}:`,
                values: validOptions,
                selectableCount: 1
            }
        });
       }
        
            let selectedOption = args.slice(1).join(" ").trim();
            if (!validOptions.includes(selectedOption)) {
                return m.reply(`> *– 乂 Opsi tidak valid! Berikut daftar opsi:*\n\n${validOptions.map((v, i) => `> ${i + 1}. ${v}`).join("\n")}`);
            }

            const options = {
                method: "POST",
                url: type === "expression" ? "https://api.lovita.io/turnMe/expression" :
                    type === "transform" ? "https://api.lovita.io/turnMe/transform" :
                    "https://api.lovita.io/turnMe/age",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Func.random(["Rk-865398da3e89a11620187a01de45b5e2", "Rk-05e7472153248f91ee66da16fb2383a2"]),
                },
                data: type === "age" ? {
                        init_image: sock.turnme[m.sender].imageUrl,
                        age: selectedOption
                    } :
                    type === "expression" ? {
                        init_image: sock.turnme[m.sender].imageUrl,
                        expression: selectedOption
                    } :
                    {
                        init_image: sock.turnme[m.sender].imageUrl,
                        style_id: selectedOption,
                        num_image: 1
                    },
            };

            const resultUrl = await axios.request(options)
                .then(res => res.data.status ? res.data.result.images[0] : null)
                .catch(err => {
                    console.error("Error processing image:", err.message);
                    return null;
                });
            delete sock.turnme[m.sender];
            if (resultUrl) {
                await sock.sendMessage(m.cht, {
                    image: {
                        url: resultUrl
                    },
                    caption: `> ✅ Berhasil diproses dengan gaya: *${selectedOption}*`,
                }, {
                    quoted: m
                });
            } else {
                m.reply("❌ Gagal memproses gambar. Silakan coba lagi.");
            }
    },
};