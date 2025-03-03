module.exports = {
    command: "stopmenfess",
    alias: ["tolakmenfess", "stopconfes"],
    category: ["menfess"],
    settings: {},
    description: "Menolak Pesan Menfess",
    async run(m, {
        sock,
        text
    }) {
        switch (m.command) {
            case "stopmenfess":
            case "tolakmenfess":
            case "stopconfes": {
                sock.menfes = sock.menfes ?? {};
                const find = Object.values(sock.menfes).find(menpes => [menpes.a, menpes.b].includes(m.sender));
                if (!find) return m.reply("Belum ada sesi menfess");

                const to = find.a === m.sender ? find.b : find.a;
                await sock.sendMessage(to, {
                    text: "_Sesi menfess ini telah dihentikan._",
                    mentions: [m.sender],
                });
                m.reply("Sesi menfess dihentikan.");
                delete sock.menfes[find.id];
            }
            break;
        }
    }
}
