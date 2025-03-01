class Command {
    constructor() {
        this.command = "acc";
        this.alias = ["acc"];
        this.category = ["group"];
        this.settings = { group: true, admin: true, botAdmin: true };
        this.description = "Menyetujui atau menolak member baru";
        this.loading = false;
    }

    run = async (m, { sock }) => {
        const groupId = m.cht;
        const subCommand = m.args[0];
        const options = m.args[1];

        if (!subCommand) {
            return m.reply(
                `> *– 乂 Panduan Penggunaan Perintah* 💡\n\n` +
                `> 1. Gunakan *\`--list\`* untuk melihat daftar permintaan bergabung\n` +
                `> 2. Gunakan *\`--approve\`* untuk menyetujui permintaan bergabung\n` +
                `> 3. Gunakan *\`--reject\`* untuk menolak permintaan bergabung`
            );
        }

        const joinRequestList = await sock.groupRequestParticipantsList(groupId);

        const formatDate = (timestamp) =>
            new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date(timestamp * 1000));

        switch (subCommand) {
            case "--list":
                if (!joinRequestList || joinRequestList.length === 0) {
                    return m.reply("> ❗ Tidak ada permintaan bergabung yang tertunda.");
                }

                const formattedList = joinRequestList
                    .map((request, i) => `> *${i + 1}.* ${request.jid.split("@")[0]}\n> - *Method* : ${request.request_method}\n> - *Waktu* : ${formatDate(request.request_time)}`)
                    .join("\n\n");

                return m.reply(
                    `> *– 乂 Daftar Permintaan Bergabung* 📥\n\n` +
                    `${formattedList}\n\n` +
                    `> Gunakan *\`${m.prefix + m.command} --approve nomor\`* atau *\`${m.prefix + m.command} --reject nomor\`* untuk mengelola permintaan.`
                );

            case "--approve":
            case "--reject":
                if (!options) {
                    return m.reply("> ❗ Mohon masukkan nomor atau gunakan 'all'");
                }

                if (!joinRequestList || joinRequestList.length === 0) {
                    return m.reply("> ❗ Tidak ada permintaan bergabung yang tertunda.");
                }

                if (options === "all") {
                    let formattedResponse = "";
                    for (const request of joinRequestList) {
                        const response = await sock.groupRequestParticipantsUpdate(
                            groupId,
                            [request.jid],
                            subCommand === "--approve" ? "approve" : "reject"
                        );
                        const status = response[0]?.status === 200 ? "✅ Berhasil" : "❌ Gagal";
                        formattedResponse += `> - *Nomor* : ${request.jid.split("@")[0]}\n> - *Status* : ${status}\n\n`;
                    }
                    return m.reply(
                        `> *– 乂 ${subCommand === "--approve" ? "Penerimaan" : "Penolakan"} Semua Permintaan* ✅❌\n\n` +
                        `${formattedResponse}`
                    );
                } else {
                    const participant = joinRequestList.find(request => request.jid.split("@")[0] === options);
                    if (!participant) {
                        return m.reply("> ❗ Nomor tersebut tidak ada dalam daftar permintaan bergabung.");
                    }

                    const response = await sock.groupRequestParticipantsUpdate(
                        groupId,
                        [participant.jid],
                        subCommand === "--approve" ? "approve" : "reject"
                    );
                    const status = response[0]?.status === 200 ? "✅ Berhasil" : "❌ Gagal";

                    return m.reply(
                        `> *– 乂 ${subCommand === "--approve" ? "Penerimaan" : "Penolakan"} Permintaan* ✅❌\n\n` +
                        `> - *Nomor* : ${participant.jid.split("@")[0]}\n` +
                        `> - *Status* : ${status}`
                    );
                }

            default:
                return m.reply(
                    `> *– 乂 Panduan Penggunaan Perintah* 💡\n\n` +
                    `> 1. Gunakan *\`--list\`* untuk melihat daftar permintaan bergabung\n` +
                    `> 2. Gunakan *\`--approve\`* untuk menyetujui permintaan bergabung\n` +
                    `> 3. Gunakan *\`--reject\`* untuk menolak permintaan bergabung`
                );
        }
    }
}

module.exports = new Command();