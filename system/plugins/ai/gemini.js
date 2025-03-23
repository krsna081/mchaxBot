// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

module.exports = {
  command: "gemini",
  alias: ["gm"],
  category: ["ai"],
  description: "Chat dgn gemini",
  async run(m, { text, Uploader }) {
    if (!m.text) return m.reply("> mana m.textnya?");
    m.react("🕐");
    let q = m.quoted ? m.quoted : m;
    try {
      if (
        /image|video|audio/.test(q.msg.mimetype) ||
        /application\/pdf/.test(q.msg.mimetype)
      ) {
        let media = await q.download();
        let url = await Uploader.catbox(media);
        const { data } = await axios.get(`https://api.hiuraa.my.id/ai/gemini-advanced?text=${text}&_mediaUrl=${url}&sessionid=${m.sender}`);
        m.reply(data.result);
      } else {
        const { data } = await axios.get(`https://api.hiuraa.my.id/ai/gemini-advanced?text=${text}&_mediaUrl=&sessionid=${m.sender}`);
        m.reply(data.result);
      }
    } catch (err) {
      throw err;
    }
  },
};
