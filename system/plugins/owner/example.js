// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
    command: "example",
    alias: ["exp"],
    settings: {
        owner: true,
    },
    description: "Fitur Contoh Bot",
    async run(m, {
        text
    }) {
        const title = `*╭──[ 乂 Example - Code ]*`;
        const message = `${title}\n᎒⊸ Pilih tipe *1*, *2*, & *3* sesuai kebutuhan Anda.\n╰────────────•`;

        if (!text) {
            return m.reply({
                poll: {
                    name: message,
                    values: [`${m.prefix + m.command} 1`, `${m.prefix + m.command} 2`, `${m.prefix + m.command} 3`],
                    selectableCount: 1,
                },
            });
        }

        // Validasi input
        const option = Number(text);
        if (option === 1) {
            const code = `
class Command {
    constructor() {
        this.command = "";
        this.alias = [];
        this.category = [];
        this.settings = {};
        this.description = "";
        this.loading = true;
    }
    run = async (m, { sock, Func, Scraper, config, store }) => {
        // Lakukan sesuatu di sini
    };
}

module.exports = new Command();`;
            return m.reply(`*– 乂 Tipe 1 - Code*\n\`\`\`${code}\`\`\``);
        } else if (option === 2) {
            const code = `
module.exports = {
    command: "",
    alias: [],
    category: [],
    settings: {},
    description: "",
    loading: true,
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
        // Lakukan sesuatu di sini
    },
};`;
            return m.reply(`*– 乂 Tipe 2 - Code*\n\`\`\`${code}\`\`\``);
        } else if (option === 3) {
            const code = `let mchax = async (m, { sock, Func, Scraper, Uploader, store, text, config }) => {
        // Lakukan sesuatu di sini
}

mchax.command = ""
mchax.alias = []
mchax.category = []
mchax.settings = { }
mchax.description = ""
mchax.loading = true

module.exports = mchax`
            return m.reply(`*– 乂 Tipe 3 - Code*\n\`\`\`${code}\`\`\``);
        } else {
            return m.reply({
                poll: {
                    name: `${message}\n\n> ❌ Pilihan tidak valid, silakan pilih antara 1 atau 2.`,
                    values: [`${m.prefix + m.command} 1`, `${m.prefix + m.command} 2`, `${m.prefix + m.command} 3`],
                    selectableCount: 1,
                },
            });
        }
    },
};