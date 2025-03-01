const axios = require("axios");

module.exports = {
  command: "script",
  alias: ["sc", "scbot"],
  category: ["info"],
  description: "📜 Dapatkan Script Bot Secara Gratis",
  async run(m, { sock, Func }) {
    let data = await axios
      .get("https://api.github.com/repos/AxellNetwork/NekoBot")
      .then((a) => a.data);

    let cap = "*– 乂 Informasi - Script Bot*\n\n";
    cap += `> 🧩 *Nama:* ${data.name}\n`;
    cap += `> 👤 *Pemilik:* ${data.owner.login}\n`;
    cap += `> ⭐ *Star:* ${data.stargazers_count}\n`;
    cap += `> 🍴 *Forks:* ${data.forks}\n`;
    cap += `> 📅 *Dibuat sejak:* ${Func.ago(data.created_at)}\n`;
    cap += `> 🔄 *Terakhir Update:* ${Func.ago(data.updated_at)}\n`;
    cap += `> 🔄 *Terakhir Publish:* ${Func.ago(data.pushed_at)}\n`;
    cap += `> 🔗 *Link Repository:* ${data.html_url}\n\n`;
    cap +=
      "🔧 *Fitur Utama Script Bot:*\n" +
      "> ✅ *Support Case x Plugins*\n" +
      "> ✅ *Ukuran Script Ringan*\n" +
      "> ✅ *100% Menggunakan Scrape*\n" +
      "> ✅ *Respon Polling & Edit*\n" +
      "> ✅ *Auto Reload File Scrape*\n" +
      "> ✅ *Support Run Di Mana Saja*";

    m.reply(cap);
  },
};
