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
const util = require("node:util");

async function events(
    m, {
        sock,
        config,
        text,
        plugins,
        Func,
        Scraper,
        Uploader,
        store,
        isAdmin,
        botAdmin,
        isPrems,
        isBanned,
    },
) {
    if (
        [">", "x"].some((a) => m.command.toLowerCase().startsWith(a)) &&
        m.isOwner
    ) {
        let evalCmd = "";
        await m.react("⚡");
        try {
            evalCmd = /await/i.test(m.text) ?
                eval("(async() => { " + m.text + " })()") :
                eval(m.text);
        } catch (e) {
            evalCmd = e;
        }
        new Promise((resolve, reject) => {
                try {
                    resolve(evalCmd);
                } catch (err) {
                    reject(err);
                }
            })
            ?.then((res) => m.reply(util.format(res)))
            ?.catch((err) => m.reply(util.format(err)));
    }
    if (
        ["$"].some((a) => m.command.toLowerCase().startsWith(a)) &&
        m.isOwner
    ) {
        await m.react("🚀");
        try {
            exec(m.text, async (err, stdout) => {
                if (err) return m.reply(util.format(err));
                if (stdout) return m.reply(util.format(stdout));
            });
        } catch (e) {
            await m.reply(util.format(e));
        }
    }
}

module.exports = {
    events,
};