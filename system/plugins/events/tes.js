// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const os = require("node:os");
const fs = require("node:fs");

async function events(m, {
    sock,
    Func,
    Scraper,
    config,
    store
}) {

    let start = performance.now()
    let node = process.memoryUsage()
    let info = await fetch("https://ipwho.is").then((a) => a.json())

    if (m.body === "tes" || m.body === "bot" || m.body === "testing") {

        let pingcap = ` -  *Bot On Kok Kak*\n\n`
        pingcap += `> Speed : ${(performance.now() - start).toFixed(3)} ms
> Uptime : ${Func.toDate(os.uptime() * 1000)}
> Total Memory : ${Func.formatSize(os.totalmem() - os.freemem())} / ${Func.formatSize(os.totalmem())}
> Cpu : ${os.cpus()[0].model} ( ${os.cpus().length} CORE )
> Type : ${os.type()}
`
        m.reply(await Func.Styles(pingcap))
    }

}

module.exports = {
    events
}