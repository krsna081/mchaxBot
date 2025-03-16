module.exports = {
    command: "enable/disable",
    alias: ["enable", "disable", "on", "off", "true", "false"],
    category: ["owner", "group"],
    settings: {},
    description: "",
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        let isEnable = /true|enable|(turn)?on/i.test(m.command);
        let chat = db.list().group[m.cht];
        let settings = db.list().settings;
        let user = db.list().user[m.sender];
        let type = (m.args[0] || '').toLowerCase()
        let isAll = false
        let isUser = false

        let listOptions = `*– 乂 Daftar Pilihan Owner :*
- anticall ( ${settings.anticall} )
- online ( ${settings.online} )
- private ( ${settings.private} )
- reactsw ( ${settings.reactsw} )
- self ( ${settings.self} )`;
        if (m.isGroup) {
            listOptions += `

*– 乂 Daftar Pilihan Group :*
- action ( ${chat.action ? 'on' : 'off'} )
- antibot ( ${chat.anti.bot ? 'on' : 'off'} )
- antigctag ( ${chat.anti.gctag ? 'on' : 'off'} )
- antilink ( ${chat.anti.link ? 'on' : 'off'} )
- antinsfw ( ${chat.anti.nsfw ? 'on' : 'off'} )
- antitoxic ( ${chat.anti.toxic ? 'on' : 'off'} )`;
        }

        switch (type) {
            case 'action':
                if (m.isGroup && !(m.isAdmin || m.isOwner)) return m.reply(config.messages.admin)
                chat.action = isEnable
            case 'antibot':
                if (m.isGroup && !(m.isAdmin || m.isOwner)) return m.reply(config.messages.admin)
                chat.anti.bot = isEnable
                break
            case 'antilink':
                if (m.isGroup && !(m.isAdmin || m.isOwner)) return m.reply(config.messages.admin)
                chat.anti.link = isEnable
                break
            case 'antitoxic':
                if (m.isGroup && !(m.isAdmin || m.isOwner)) return m.reply(config.messages.admin)
                chat.anti.toxic = isEnable
                break
            case 'antinsfw':
                if (m.isGroup && !(m.isAdmin || m.isOwner)) return m.reply(config.messages.admin)
                chat.antiNsfw = isEnable
                break
            case 'anticall':
                isAll = true
                if (!m.isOwner) return m.reply(config.messages.owner)
                settings.anticall = isEnable
                break
            case 'online':
                isAll = true
                if (!m.isOwner) return m.reply(config.messages.owner)
                settings.online = isEnable
                break
            case 'private':
                isAll = true
                if (!m.isOwner) return m.reply(config.messages.owner)
                settings.private = isEnable
                break
            case 'reactsw':
                isAll = true
                if (!m.isOwner) return m.reply(config.messages.owner)
                settings.reactsw = isEnable
                break
            case 'self':
                isAll = true
                if (!m.isOwner) return m.reply(config.messages.owner)
                settings.self = isEnable
                break
            default:
                return m.reply(`${listOptions}`)
        }

        m.reply(`*\`${type}\`* berhasil di *\`${isEnable ? 'activate' : 'disable'}\`* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk obrolan ini'}`.trim())
    }
}