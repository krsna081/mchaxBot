// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const color = require("chalk");

module.exports = (m) => {
    const divider = color.magenta.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    let info = "";
    info += `${divider}\n`;
    info += color.cyan.bold("– 乂 📬 Chat Information\n");
    info += `${divider}\n`;
    info += color.white.bold(`🗨️ Dari       : `) + 
            color.green.bold(m.isGroup ? "Group Chat" : "Private Chat") + "\n";

    if (m.isGroup) {
        info += color.white.bold(`👥 Subject    : `) + color.yellow.bold(m.metadata.subject) + "\n";
    }
    info += color.white.bold(`📂 Tipe       : `) + color.blue.bold(m.type) + "\n";
    info += color.white.bold(`🙋 Nama       : `) + color.magenta.bold(m.pushName) + "\n";
    info += `${divider}\n`;

    const body = m.isBot
        ? color.red.bold(` ✏️ Pesan: ${m.body} `)
        : color.white.bold(` ✏️ Pesan: ${m.body} `);

    info += `${body}\n`;
    info += `${divider}`;

    console.log(info);
};
