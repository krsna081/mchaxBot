// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

async function events(m, { sock, Func }) {
    this.autosholat = this.autosholat || {};
    let id = m.cht;
    if (id in this.autosholat) return;
    let jadwalSholat = {
      Fajr: '04:22',
      Sunrise: '05:40',
      Dhuhr: '11:50',
      Asr: '15:03',
      Sunset: '18:00',
      Maghrib: '18:00',
      Isha: '19:30',
      Imsak: '04:12',
      Midnight: '23:50',
      Firstthird: '21:53',
      Lastthird: '01:47'
    };
    const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const timeNow = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
        if (timeNow === waktu) {
            this.autosholat[id] = true;
            let audioUrl =
                sholat.toLowerCase() === "fajr"
                    ? "https://files.catbox.moe/69gmmi.opus"
                    : "https://files.catbox.moe/s8vvbd.opus";

            await sock.sendMessage(m.cht, {
                audio: { url: audioUrl },
                mimetype: "audio/mp4",
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: Func.Styles(`Waktu ${sholat} telah tiba`),
                        body: Func.Styles("Untuk wilayah pati dan sekitarnya."),
                        thumbnailUrl: "https://raw.githubusercontent.com/Rezaofc2/uploader/main/uploads/1737976196001.jpeg",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            });
            setTimeout(() => {
                delete this.autosholat[id];
            }, 57000);
        }
    }
}

module.exports = { events };