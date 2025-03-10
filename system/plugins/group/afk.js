// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

module.exports = {
    command: "afk",
    alias: ["afk"],
    category: ["group"],
    settings: { group: true },
    description: "afk di group agar tidak berisik",
    loading: false,
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
    let users = db.list().user[m.sender].afk
      try {
         users.afkTime = +new Date
         users.afkReason = text
         users.afkObj = m
         return m.reply(`@${m.sender.split`@`[0]} is now AFK!`)
      } catch (e) {
         return m.reply(e.message)
      }
   },
};