// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

let axios = require("axios");

let mchax = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {
    if (!text) throw `❗ Masukan pertanyaan untuk bertanya kepada luminai`;
    const requestData = {
        content: text,
        user: m.sender,
    };
    const quoted = m && (m.quoted || m);

    try {
        let response;
        if (quoted && /image/.test(quoted.mimetype || quoted.msg.mimetype)) {
            requestData.imageBuffer = await quoted.download();
        }

        response = (await axios.post("https://luminai.my.id", requestData)).data
            .result;
        m.reply(response);
    } catch (e) {
        m.reply(e.message);
    }
}

mchax.command = "luminai";
mchax.alias = ["lumin"];
mchax.category = ["ai"];
mchax.settings = {
    limit: true
};
mchax.description = "Bertanya kepada luminai";
mchax.loading = true;

module.exports = mchax;