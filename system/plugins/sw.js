// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const {
    getContentType,
    jidNormalizedUser
} = require("baileys");

module.exports = {
    command: "sw",
    alias: ["sw"],
    category: ["owner"],
    settings: {
        owner: true
    },
    description: "Melihat daftar story atau mengambil story berdasarkan nomor",
    loading: false,
    async run(m, {
        conn,
        store,
        sock,
        text
    }) {
        try {
            if (!store.messages['status@broadcast'] || store.messages['status@broadcast'].array.length === 0)
                throw 'Gaada 1 status pun Story yang Tersedia.';

            let stories = store.messages['status@broadcast'].array;
            let story = stories.filter(v => v.message && v.message.protocolMessage?.type !== 0);

            if (story.length === 0) throw 'Tidak ada story yang Tersedia.';

            if (text.startsWith('--get')) {
                if (!text) return m.reply("> *Harap masukkan nomor dan urutan untuk mendownload story.*");

                let args = text.replace('--get', '').split(',').map(val => val.trim());
                let nomor = args.shift()?.replace(/\D+/g, '');
                let urutanList = args.map(u => parseInt(u.replace(/\D+/g, '')) - 1);

                if (!nomor) return m.reply("> *❌ Gunakan sw --get nomor, urutan1, urutan2, ...*");
                nomor = nomor + '@s.whatsapp.net';

                let filteredStory = story.filter(v =>
                    (v.key && v.key.participant === nomor) || v.participant === nomor
                );

                if (filteredStory.length === 0) throw 'Story tersebut tidak Tersedia.';

                // Jika tidak ada urutan, ambil semua story dari nomor tersebut
                if (urutanList.length === 0) {
                    urutanList = [...Array(filteredStory.length).keys()]; // Ambil semua index story
                }

                // Filter index yang valid
                urutanList = urutanList.filter(i => i >= 0 && i < filteredStory.length);
                if (urutanList.length === 0) throw 'Urutan tidak valid atau tidak ada story yang tersedia.';

                for (let i = 0; i < urutanList.length; i++) {
                    await m.reply({
                        forward: filteredStory[urutanList[i]],
                        force: true
                    });
                    if (i < urutanList.length - 1) await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2 detik
                }
            } else {
                const result = {};
                for (let obj of story) {
                    let participant = obj.key.participant || obj.participant;
                    participant = jidNormalizedUser(participant === 'status_me' ? sock.user.id : participant);

                    if (participant === m.sender) continue;

                    if (!result[participant]) result[participant] = [];
                    result[participant].push(obj);
                }

                let type = mType => {
                    let contentType = getContentType(mType);
                    return contentType ? (contentType === 'extendedTextMessage' ? 'text' : contentType.replace('Message', '')) : 'unknown';
                };

                let responseText = '*– 乂 Penggunaan list Story 💡:*\n\n';
                responseText += '> 🔄  *`--nomor,urutan`* untuk mendownload story yang tersedia\n\n';
                responseText += '*– 乂 Daftar Story yang Tersedia:*\n\n';

                let i = 1;
                for (let id of Object.keys(result)) {
                    if (!id || result[id].length === 0) continue;

                    let name = await sock.getName(id).catch(() => id);
                    responseText += `> ${name} @${id.split("@")[0]}\n`;
                    let storyList = result[id].map((v, idx) => `- ${idx + 1}. ${type(v.message)}`).join('\n');
                    responseText += `${storyList}\n`;
                    i++;
                }

                if (i === 1) throw 'Tidak ada story yang tersedia selain milikmu.';
                await m.reply(responseText.trim(), {
                    mentions: Object.keys(result)
                });
            }
        } catch (err) {
            await m.reply(`> ⚠️ *Error: ${err}*`);
        }
    }
};