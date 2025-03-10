// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    generateWAMessage,
    areJidsSameUser,
    proto
} = require("baileys");

async function events(m, {
    sock
}) {
    sock.sendAliasMessage = async (jid, mess = {}, alias = [], quoted = null) => {
        function check(arr) {
            if (!Array.isArray(arr) || !arr.length) return false;
            for (const item of arr) {
                if (typeof item !== "object" || item === null) return false;
                if (!item.hasOwnProperty("alias")) return false;
                if (!Array.isArray(item.alias) && typeof item.alias !== "string") return false;
                if (item.hasOwnProperty("response") && typeof item.response !== "string") return false;
                if (item.hasOwnProperty("eval") && typeof item.eval !== "string") return false;
            }
            return true;
        }

        if (!check(alias)) return "Alias format is not valid!";
        let message = await sock.sendMessage(jid, mess, {
            quoted
        });

        if (!sock.alias[jid]) sock.alias[jid] = {};
        sock.alias[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            alias
        };

        return message;
    };

    sock.sendInputMessage = async (jid, mess = {}, target = "all", timeout = 60000, quoted = null) => {
        let time = Date.now();
        let message = await sock.sendMessage(jid, mess, {
            quoted
        });

        if (!sock.input[jid]) sock.input[jid] = {};
        sock.input[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            target
        };

        while (Date.now() - time < timeout && !sock.input[jid][message.key.id].hasOwnProperty("input")) {
            await sock.delay(500);
        }

        return sock.input[jid][message.key.id].input;
    };

    if (!sock.alias) sock.alias = {};
    if (!sock.input) sock.input = {};

    if (m.quoted) {
        const quotedId = m.quoted.id;

        // Cek input message
        if (sock.input[m.cht]?.[quotedId]?.target === "all" || sock.input[m.cht]?.[quotedId]?.target === m.sender) {
            sock.input[m.cht][quotedId].input = m.body;
        }

        // Cek alias message
        if (sock.alias.hasOwnProperty(m.cht) && sock.alias[m.cht].hasOwnProperty(quotedId)) {
            let aliasData = sock.alias[m.cht][quotedId];

            for (const aliasObj of aliasData.alias) {
                if (Array.isArray(aliasObj.alias) && !aliasObj.alias.map(v => v.toLowerCase()).includes(m.body.toLowerCase())) continue;
                else if (aliasObj.alias.toLowerCase() !== m.body.toLowerCase()) continue;
                else {
                    if (aliasObj.response) await m.emit(aliasObj.response);
                    if (aliasObj.eval) await eval(aliasObj.eval);

                    // Hapus alias setelah pengguna memilih
                    delete sock.alias[m.cht][quotedId];

                    // Hapus juga jid jika sudah kosong
                    if (Object.keys(sock.alias[m.cht]).length === 0) delete sock.alias[m.cht];

                    break; // Keluar dari loop setelah eksekusi
                }
            }
        }
    }
};

module.exports = {
    events
};