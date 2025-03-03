module.exports = {
    command: "balasmenfess",
    alias: [],
    category: ["menfess"],
    settings: {},
    description: "Membalas Pesan Menfess",
    async run(m, {
        sock,
        text
    }) {
        switch (m.command) {
            case "balasmenfess": {
                sock.menfes = sock.menfes ?? {};
                const roof = Object.values(sock.menfes).find(menpes => [menpes.a, menpes.b].includes(m.sender));
                if (!roof) return m.reply("Belum ada sesi menfess");

                const room = Object.values(sock.menfes).find(room => [room.a, room.b].includes(m.sender) && room.state === 'WAITING');
                if (!room) return m.reply("Tidak ada sesi menfess yang sedang menunggu");

                const other = [room.a, room.b].find(user => user !== m.sender);
                room.b = m.sender;
                room.state = 'CHATTING';
                sock.menfes[room.id] = {
                    ...room
                };

                await sock.sendMessage(other, {
                    text: `_@${m.sender.split("@")[0]} telah menerima menfess kamu, sekarang kamu bisa chat lewat bot ini._\n\n*NOTE:* Ketik .stopmenfess untuk berhenti.`,
                    mentions: [m.sender],
                });
                m.reply("Menfess diterima, sekarang kamu bisa chat!");
                m.reply("Silakan balas pesan langsung di chat ini. Semua pesan akan diteruskan.");
            }
            break;
        }
    }
}
