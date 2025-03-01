const { writeExif } = require(process.cwd() + "/lib/sticker");
const axios = require("axios");

class Command {
  constructor() {
    this.command = "qc";
    this.alias = [];
    this.category = ["tools"];
    this.settings = {
      limit: true,
    };
    this.description = "Membuat bubble chat";
    this.loading = true;
  }

  run = async (m, { sock, Func, Scraper, config, store, text, Uploader }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";

    const colors = {
        1: { name: "hijau", code: "#00FF00" },
        2: { name: "merah", code: "#FF0000" },
        3: { name: "biru", code: "#0000FF" },
        4: { name: "hitam", code: "#161616" },
        5: { name: "kuning", code: "#FFFF00" },
        6: { name: "ungu", code: "#800080" },
        7: { name: "jingga", code: "#FFA500" },
        8: { name: "pink", code: "#FFC0CB" },
        9: { name: "coklat", code: "#A52A2A" },
        10: { name: "abuabu", code: "#808080" },
        11: { name: "emas", code: "#FFD700" },
        12: { name: "perak", code: "#C0C0C0" },
        13: { name: "cyan", code: "#00FFFF" },
        14: { name: "magenta", code: "#FF00FF" },
    };

    let color = "#FFFFFF";

    if (m.args.join(" ").includes("|")) {
        const [inputColor, inputText] = m.args.join(" ").split("|");

        const selectedColor = Object.values(colors).find(
            c => c.name.toLowerCase() === inputColor.trim().toLowerCase()
        );

        if (selectedColor) {
            color = selectedColor.code;
            text = inputText.trim();
        } else {
            const colorList = Object.entries(colors)
                .map(([num, { name }]) => `*( ${num} )* ${name}`)
                .join("\n");

            return m.reply(
                `*– 乂 Daftar Color yang Tersedia:*\n\n${colorList}`
            );
        }
    }

    if (!text && !m.quoted) {
        throw `Masukan pesan untuk di buat sticker!`;
    }
    
    let txt = text ? text : typeof q.text == 'string' ? q.text : '';
    const img = await q.download?.();
    const pp = await sock
        .profilePictureUrl(q.sender, "image")
        .catch(() => "");
    const obj = {
        type: "quote",
        format: "png",
        backgroundColor: color,
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            media: mime ? {
                url: await Uploader.Uguu(img)
            } : undefined,
            avatar: true,
            from: {
                id: m.cht.split("@")[0],
                name: await sock.getName(q.sender),
                photo: {
                    url: pp
                },
            },
            text: mime ? text : txt,
            replyMessage: {},
        }],
    };

    const json = await axios.post(
        "https://quotly.netorare.codes/generate",
        obj, {
            headers: {
                "Content-Type": "application/json"
            },
        }
    );

    const buffer = Buffer.from(json.data.result.image, "base64");
      const sticker = await writeExif(
        {
          mimetype: "image",
          data: buffer,
        },
        {
          packName: config.sticker.packname,
          packPublish: config.sticker.author,
        },
      );
      m.reply({
        sticker,
      });
  };
}

module.exports = new Command();