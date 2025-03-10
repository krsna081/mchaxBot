// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    exec
} = require("child_process");
const {
    promisify
} = require("util");
const execPromise = promisify(exec);

class Command {
    constructor() {
        this.command = "grep";
        this.alias = [];
        this.category = ["tools"];
        this.settings = {
            owner: true
        };
        this.description = "melihat anu dari ini";
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        store
    }) => {
        const text =
            m.args.join(" ") ||
            m.quoted?.text ||
            m.quoted?.body ||
            m.quoted?.description;
        if (!text)
            return m.reply(`Harap masukan pesan untuk dilihat apa saja yang ada pada filebot`);
        const folderPath = "./";
        const commandStr = `grep -rnw '${folderPath}' -e '${text}' --include='*.js' --exclude-dir='node_modules' --color=never`;
        try {
            const {
                stdout,
                stderr
            } = await execPromise(commandStr);
            if (stderr) throw new Error(stderr);
            const lines = stdout.split("\n").filter(Boolean);
            if (lines.length === 0) {
                await m.reply("❌ Tidak ada kecocokan yang ditemukan.");
                return;
            }
            const resultsText = lines
                .map((line, index) => {
                    const match = line.match(/^(.*?):(\d+):(.+)$/);
                    if (!match)
                        return `*– 乂 Hasil Grep ${index + 1} :*\n\n> - *Isi :* \`${line.trim()}\``;
                    const [, path, lineNum, content] = match;
                    return `> - *Hasil :* ${index + 1}\n\n> - *Garis :* ${lineNum}\n> - *Isi :* \`${content.trim()}\`\n> - *Jalur :* ${path}`;
                })
                .join("\n________________________\n");
            const resultMessage = `> - *Meminta :* ${text}

${resultsText}\n\n> *Total Result :* ${lines.length}\n`;
            m.reply(resultMessage);
        } catch (e) {}
    }
}

module.exports = new Command();