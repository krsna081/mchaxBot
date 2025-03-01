class Command {
    constructor() {
        this.command = "ai";
        this.alias = ["openai", "gpt", "gpt4"];
        this.category = ["ai"];
        this.settings = {};
        this.description = "AI Gwen dengan model dan tipe berbeda setiap user";
        this.loading = true;
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        text,
        store
    }) => {
        const user = db.list().user[m.sender]
        user.gwenai = {
            model: "9",
            type: "1"
        };

        const validModels = {
            "1": "qwen-plus-latest",
            "2": "qwen-max-latest",
            "3": "qwen-turbo-latest",
            "4": "qwen2.5-72b-instruct",
            "5": "qwen2.5-14b-instruct",
            "6": "qwen2.5-7b-instruct",
            "7": "qwen2.5-4b-instruct",
            "8": "qwen2.5-1.8b-instruct",
            "9": "qwen2.5-vl-72b-instruct"
        };

        const validChatTypes = {
            "1": "t2t",
            "2": "search"
        };

        const cmd = m.args[0];
        const value = m.args[1];

        if (cmd === "--model") {
            if (!validModels[value]) return m.reply("❌ Model tidak valid!\nGunakan angka 1-9.");
            user.gwenai.model = value;
            return m.reply(`✅ Model AI diubah menjadi: *${validModels[value]}*`);
        }

        if (cmd === "--type") {
            if (!validChatTypes[value]) return m.reply("❌ Type tidak valid!\nGunakan angka 1-2.");
            user.gwenai.type = value;
            return m.reply(`✅ Tipe AI diubah menjadi: *${validChatTypes[value]}*`);
        }

        if (!cmd) return m.reply("❌ Gunakan:\n- `ai --model nomor`\n- `ai --type nomor`\n- `ai pertanyaan`");

        if (!text) return m.reply("❌ Masukkan pertanyaan setelah `ai`.");

        const modelUser = validModels[user.gwenai.model] || validModels["9"];
        const typeUser = validChatTypes[user.gwenai.type] || validChatTypes["1"];

        const result = await Scraper.gwenai([{
                "role": "system",
                "content": `nama mu adalah nekoBot, asisten terbaik WhatsApp, kamu nggak pakai emoji ini aja ":3, ;3, :p, :0, :]", dan gaya percakapan cute dan gaul/slang`
            },
            {
                "role": "user",
                "content": text
            }
        ], {
            model: modelUser,
            sessionId: m.sender,
            chatType: typeUser
        });

        return m.reply(result);
    };
}

module.exports = new Command();