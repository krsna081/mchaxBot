const fs = require("fs")

module.exports = {
  command: "",
  alias: [
    "addsrv",
    "addusr",
    "addpanel",
    "buatpanel",
    "cp1gb",
    "cp2gb",
    "cp3gb",
    "cp4gb",
    "cp5gb",
    "cp6gb",
    "cp7gb",
    "cp8gb",
    "cp9gb",
    "cp10gb",
    "cpanel",
    "cpunli",
    "delusr",
    "delsrv",
    "detsrv",
    "detusr",
    "listadmin",
    "listsrv",
    "listusr",
    "nodeinfo",
    "pannel",
    "reinstall",
    "restartsrv",
    "startsrv",
    "stopsrv",
    "suspend",
    "unsuspend",
  ],
  category: [],
  settings: {},
  description: "",
  async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
    sock.panel = sock.panel || {}
    const users = db.list().user[m.sender]
    const saldo = `*• Your Balance :* ${Func.formatNumber(users.saldo)}`

    // Helper function to format dates
    async function tanggal(date) {
      return await require("moment-timezone")(date).tz("Asia/Jakarta").format("DD/MM/YYYY")
    }

    // Helper function to get server status emoji
    function getStatusEmoji(status) {
      switch (status) {
        case "running":
          return "🟢"
        case "starting":
          return "🟡"
        case "stopping":
          return "🟠"
        case "stopped":
          return "🔴"
        default:
          return "⚪"
      }
    }

    switch (m.command) {
      case "pannel":
      case "cpanel":
        {
          m.reply(`*╭─────❲ PTERODACTYL PANEL ❳─────╮*
*│*
*│ 🚀 SERVER PACKAGES*
*│*
*│ 🔹 BASIC PLANS:*
*│* • 1GB Disk / 50% CPU = Rp: 2.000
*│* • 2GB Disk / 100% CPU = Rp: 3.000
*│* • 3GB Disk / 150% CPU = Rp: 4.000
*│* • 4GB Disk / 200% CPU = Rp: 5.000
*│* • 5GB Disk / 250% CPU = Rp: 6.000
*│*
*│ 🔹 PREMIUM PLANS:*
*│* • 6GB Disk / 300% CPU = Rp: 7.000
*│* • 7GB Disk / 350% CPU = Rp: 8.000
*│* • 8GB Disk / 400% CPU = Rp: 9.000
*│* • 9GB Disk / 450% CPU = Rp: 10.000
*│* • 10GB Disk / 500% CPU = Rp: 12.000
*│* • ∞ Disk / ∞ CPU = Rp: 15.000
*│*
*│ 🔰 BENEFITS:*
*│* ✅ Fresh Server - No Lag
*│* ✅ 24/7 Uptime
*│* ✅ 15-Day Warranty
*│* ✅ Protected Scripts
*│* ✅ Data-Saving Technology
*│* ✅ Simple Management
*│*
*╰───────────────────────────╯*

${saldo}

*Type:* ${m.prefix}cpanel username,number,false *to create panel*`)
        }
        break

      case "nodeinfo":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)

          const { key } = await sock.sendMessage(m.cht, { text: "🔍 Fetching node information..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/nodes", {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))

            let nodeInfo = `*╭─────❲ NODE INFORMATION ❳─────╮*\n`

            data.data.forEach((node, index) => {
              const attr = node.attributes
              nodeInfo += `*│*\n`
              nodeInfo += `*│ 📊 NODE #${index + 1}*\n`
              nodeInfo += `*│* • Name: ${attr.name}\n`
              nodeInfo += `*│* • ID: ${attr.id}\n`
              nodeInfo += `*│* • Memory: ${Func.formatNumber(attr.memory)} MB\n`
              nodeInfo += `*│* • Disk: ${Func.formatNumber(attr.disk)} MB\n`
              nodeInfo += `*│* • Allocations: ${node.meta.pagination.count}\n`
              nodeInfo += `*│* • Location: ${attr.location_id}\n`
              nodeInfo += `*│* • Status: ${attr.public ? "Public" : "Private"}\n`
              nodeInfo += `*│* • FQDN: ${attr.fqdn}\n`
              nodeInfo += `*│*\n`
            })

            nodeInfo += `*╰───────────────────────────╯*`

            await sock.sendMessage(m.cht, { text: nodeInfo, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "addusr":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          const t = text.split(",")
          if (t.length < 3) return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`)
          const username = t[0]
          const u = m.quoted ? m.quoted.sender : t[1] ? t[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.mentions[0]
          const statusInput = t[2].trim().toLowerCase()
          let status
          if (statusInput === "true" || statusInput === "y") {
            status = true
          } else if (statusInput === "false" || statusInput === "n") {
            status = false
          } else {
            return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`)
          }
          const name = username
          const email = username + "@gmail.com"
          if (!u) return
          const d = (await sock.onWhatsApp(u.split`@`[0]))[0] || {}
          const password = d.exists ? Func.makeId(8) : t[3]

          const { key } = await sock.sendMessage(m.cht, { text: "🔄 Creating User..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/users", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
              body: JSON.stringify({
                email: email,
                username: username,
                first_name: username,
                last_name: "Server",
                language: "en",
                root_admin: status,
                password: password.toString(),
              }),
            })

            const data = await f.json()
            if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))

            const user = data.attributes

            let ctf
            if (status === true) {
              ctf = `*╭─────❲ PTERODACTYL PANEL ❳─────╮*
*│*
*│ 👤 ACCOUNT INFORMATION*
*│* • Email: ${user.email}
*│* • ID: ${user.id}
*│* • Admin: ${user.root_admin ? "Yes ✓" : "No ✗"}
*│* • Created: ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}
*│*
*│ ⚠️ ADMIN RULES:*
*│* • Do not steal scripts
*│* • Do not delete servers/users
*│* • No creating other admins
*│*
*╰───────────────────────────╯*

\`\`\`Follow all rules. Violations will result in immediate removal without refund!\`\`\``
            } else {
              ctf = `*╭─────❲ PTERODACTYL PANEL ❳─────╮*
*│*
*│ 👤 ACCOUNT INFORMATION*
*│* • Email: ${user.email}
*│* • ID: ${user.id}
*│* • Admin: ${user.root_admin ? "Yes ✓" : "No ✗"}
*│* • Created: ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}
*│*
*╰───────────────────────────╯*

\`\`\`Keep your panel data safe. Save this chat as proof for warranty claims if server goes down.\`\`\``
            }

            const cap = `*✅ USER CREATED SUCCESSFULLY*
*• Admin:* ${user.root_admin ? "Yes ✓" : "No ✗"}
*• Created:* ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}

\`\`\`Account information has been sent to that number!\`\`\``

            await sock.sendMessage(m.cht, { text: cap, edit: key }, { quoted: m })
            const cok = await sock.sendMessage(u, { text: ctf })
            sock.sendMessage(
              u,
              {
                text: `- Login: ${config.cpanel.domain}\n- User: ${user.username}\n- Password: ${password.toString()}`,
              },
              { quoted: cok },
            )
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "addsrv":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          const t = text.split(",")
          if (t.length < 5)
            return m.reply(`*• Example :* ${m.prefix + m.command} *[name, number, userid, memo/disk, cpu]*`)
          const name = t[0]
          const u = m.quoted ? m.quoted.sender : t[1] ? t[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.mentions[0]
          const user_id = t[2]
          const memo_disk = t[3].split("/")
          const cpu = t[4]

          const { key } = await sock.sendMessage(m.cht, { text: "🔄 Creating Server..." }, { quoted: m })

          try {
            const f2 = await fetch(
              config.cpanel.domain + "/api/application/nests/" + config.cpanel.nets + "/eggs/" + config.cpanel.egg,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + config.cpanel.apikey,
                },
              },
            )

            const data2 = await f2.json()

            const f3 = await fetch(config.cpanel.domain + "/api/application/servers", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
              body: JSON.stringify({
                name: name + " Server",
                description: await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY"),
                user: user_id,
                egg: Number.parseInt(config.cpanel.egg),
                docker_image: data2.attributes.docker_image,
                startup: data2.attributes.startup,
                environment: {
                  STARTUP_CMD: "bash",
                  INST: "npm",
                  USER_UPLOAD: 0,
                  AUTO_UPDATE: 0,
                  CMD_RUN: "bash",
                },
                limits: {
                  memory: memo_disk[0],
                  swap: 0,
                  disk: memo_disk[1],
                  io: 500,
                  cpu: cpu,
                },
                feature_limits: {
                  databases: 0,
                  backups: 0,
                  allocations: 0,
                },
                deploy: {
                  locations: [Number.parseInt(1)],
                  dedicated_ip: false,
                  port_range: [],
                },
              }),
            })

            const res = await f3.json()
            if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))

            const server = res.attributes

            const ctf = `*╭─────❲ PTERODACTYL PANEL ❳─────╮*
*│*
*│ 🖥️ SERVER INFORMATION*
*│* • Name: ${server.name}        
*│* • ID: ${server.id}
*│* • Memory: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory + "MB"}
*│* • Disk: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk + "MB"}
*│* • CPU: ${server.limits.cpu === 0 ? "Unlimited" : server.limits.cpu + "%"}
*│* • Created: ${server.created_at}
*│*
*╰───────────────────────────╯*

\`\`\`Keep your panel data safe. Save this chat as proof for warranty claims if server goes down.\`\`\``

            sock.sendMessage(u, { text: ctf }, { quoted: config.quoted.fkontak })

            const p = `*✅ SERVER CREATED SUCCESSFULLY*
*• Memory:* ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory + "MB"}
*• Disk:* ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk + "MB"}
*• CPU:* ${server.limits.cpu === 0 ? "Unlimited" : server.limits.cpu + "%"}
*• Created:* ${server.created_at}

\`\`\`Server information has been sent to that number!\`\`\``

            await sock.sendMessage(m.cht, { text: p, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "addpanel":
      case "buatpanel": {
        const t = text.split(",")
        if (t.length < 3) {
          return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`)
        }
        const [username, number, statusInput] = t.map((i) => i.trim())

        let status
        if (statusInput === "true" || statusInput === "y") {
          if (!m.isOwner) {
            return m.reply(`*• Failed! Only owner can set status to admin (true).*`)
          }
          status = true
        } else if (statusInput === "false" || statusInput === "n") {
          status = false
        } else {
          return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`)
        }

        const existingBuyer = Object.values(sock.panel).find((panel) => panel.buyer === username)
        if (existingBuyer) {
          return m.reply(`*[ System Detected ]* Buyer with username "${username}" already exists!`)
        }

        sock.panel[m.sender] = {
          buyer: username,
          client: number,
          admin: status,
        }

        const message = `*╭─────❲ SELECT SERVER PLAN ❳─────╮*
*│*
*│* Please select your panel server plan:
*│*
*│ 🔹 BASIC PLANS:*
*│* • 1GB RAM: \`${m.prefix}cp1gb\`
*│* • 2GB RAM: \`${m.prefix}cp2gb\`
*│* • 3GB RAM: \`${m.prefix}cp3gb\`
*│* • 4GB RAM: \`${m.prefix}cp4gb\`
*│* • 5GB RAM: \`${m.prefix}cp5gb\`
*│*
*│ 🔹 PREMIUM PLANS:*
*│* • 6GB RAM: \`${m.prefix}cp6gb\`
*│* • 7GB RAM: \`${m.prefix}cp7gb\`
*│* • 8GB RAM: \`${m.prefix}cp8gb\`
*│* • 9GB RAM: \`${m.prefix}cp9gb\`
*│* • 10GB RAM: \`${m.prefix}cp10gb\`
*│*
*│ 🔹 UNLIMITED PLAN:*
*│* • Unlimited: \`${m.prefix}cpunli\`
*│*
*╰───────────────────────────╯*

${saldo}`

        m.reply(message)
        break
      }

      case "cp1gb":
      case "cp2gb":
      case "cp3gb":
      case "cp4gb":
      case "cp5gb":
      case "cp6gb":
      case "cp7gb":
      case "cp8gb":
      case "cp9gb":
      case "cp10gb":
      case "cpunli":
        {
          if (!sock.panel[m.sender]) {
            return m.reply(
              `*[ System Notice ]* Username not found or session has expired\n\n*• Example :* ${m.prefix}cpanel ${m.pushName},${m.sender.split("@")[0]},n`,
            )
          }

          var ram, disknya, cpu, saldoRequired

          switch (m.command) {
            case "cp1gb":
              ram = "1125"
              disknya = "1125"
              cpu = "50"
              saldoRequired = 2000
              break
            case "cp2gb":
              ram = "2125"
              disknya = "2125"
              cpu = "100"
              saldoRequired = 3000
              break
            case "cp3gb":
              ram = "3125"
              disknya = "3125"
              cpu = "150"
              saldoRequired = 4000
              break
            case "cp4gb":
              ram = "4125"
              disknya = "4125"
              cpu = "200"
              saldoRequired = 5000
              break
            case "cp5gb":
              ram = "5125"
              disknya = "5125"
              cpu = "250"
              saldoRequired = 6000
              break
            case "cp6gb":
              ram = "6125"
              disknya = "6125"
              cpu = "300"
              saldoRequired = 7000
              break
            case "cp7gb":
              ram = "7125"
              disknya = "7125"
              cpu = "350"
              saldoRequired = 8000
              break
            case "cp8gb":
              ram = "8125"
              disknya = "8125"
              cpu = "400"
              saldoRequired = 9000
              break
            case "cp9gb":
              ram = "9124"
              disknya = "9125"
              cpu = "450"
              saldoRequired = 10000
              break
            case "cp10gb":
              ram = "10125"
              disknya = "10125"
              cpu = "500"
              saldoRequired = 12000
              break
            default:
              ram = "0"
              disknya = "0"
              cpu = "0"
              saldoRequired = 15000
              break
          }

          if (users.saldo < saldoRequired) {
            const cap = `*❌ INSUFFICIENT BALANCE*
You need at least *${Func.formatNumber(saldoRequired)}* balance
Your current balance: *${Func.formatNumber(users.saldo)}*

Do you want to top up your balance?`
            return m.reply(cap)
          } else {
            const { key } = await sock.sendMessage(m.cht, { text: "🔄 Creating Server..." }, { quoted: m })

            try {
              const username = sock.panel[m.sender].buyer
              const u = sock.panel[m.sender].client.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
              const name = username
              const admin = sock.panel[m.sender].admin
              const email = username + "@gmail.com"
              if (!u) return
              const d = (await sock.onWhatsApp(u.split`@`[0]))[0] || {}
              const password = d.exists ? Func.makeId(8) : Func.makeId(4)

              // Create user
              const f = await fetch(config.cpanel.domain + "/api/application/users", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + config.cpanel.apikey,
                },
                body: JSON.stringify({
                  email: email,
                  username: username,
                  first_name: username,
                  last_name: "Server",
                  language: "en",
                  root_admin: admin,
                  password: password.toString(),
                }),
              })

              const data = await f.json()
              if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))

              const user = data.attributes

              // Get egg details
              const f2 = await fetch(
                config.cpanel.domain + "/api/application/nests/" + config.cpanel.nets + "/eggs/" + config.cpanel.egg,
                {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + config.cpanel.apikey,
                  },
                },
              )

              const data2 = await f2.json()

              // Create server
              const f3 = await fetch(config.cpanel.domain + "/api/application/servers", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + config.cpanel.apikey,
                },
                body: JSON.stringify({
                  name: name + " Server",
                  description: await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY"),
                  user: user.id,
                  egg: Number.parseInt(config.cpanel.egg),
                  docker_image: data2.attributes.docker_image,
                  startup: data2.attributes.startup,
                  environment: {
                    STARTUP_CMD: "bash",
                    INST: "npm",
                    USER_UPLOAD: 0,
                    AUTO_UPDATE: 0,
                    CMD_RUN: "bash",
                  },
                  limits: {
                    memory: ram,
                    swap: 0,
                    disk: disknya,
                    io: 500,
                    cpu: cpu,
                  },
                  feature_limits: {
                    databases: 5,
                    backups: 5,
                    allocations: 5,
                  },
                  deploy: {
                    locations: [Number.parseInt(1)],
                    dedicated_ip: false,
                    port_range: [],
                  },
                }),
              })

              const res = await f3.json()
              if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))

              const server = res.attributes
              users.saldo -= Number.parseInt(saldoRequired)
              delete sock.panel[m.sender]

              const p = `*✅ PANEL PURCHASE SUCCESSFUL*
*• Plan:* ${m.command.toUpperCase()}
*• Current Balance:* ${Func.formatNumber(users.saldo)}

\`\`\`Account information has been sent to that number!\`\`\``

              await sock.sendMessage(m.cht, { text: p, edit: key }, { quoted: m })

              const ctf = `*╭─────❲ PTERODACTYL PANEL ❳─────╮*
*│*
*│ 🖥️ SERVER INFORMATION*
*│* • Name: ${server.name}        
*│* • ID: ${server.id}
*│* • Memory: ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory + "MB"}
*│* • Disk: ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk + "MB"}
*│* • CPU: ${server.limits.cpu === 0 ? "Unlimited" : server.limits.cpu + "%"}
*│* • Created: ${server.created_at}
*│*
*╰───────────────────────────╯*

\`\`\`Keep your panel data safe. Save this chat as proof for warranty claims if server goes down.\`\`\``

              const cok = await sock.sendMessage(u, { text: ctf })
              sock.sendMessage(
                u,
                {
                  text: `- Login: ${config.cpanel.domain}\n- User: ${user.username}\n- Password: ${password.toString()}`,
                },
                { quoted: cok },
              )
            } catch (error) {
              await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
            }
          }
        }
        break

      case "listusr":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          const txt = text ? text : 1

          const { key } = await sock.sendMessage(m.cht, { text: "🔍 Fetching users..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/users?page=" + txt, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const user = await f.json()
            let message = `*╭─────❲ USER LIST ❳─────╮*
*│*
*│ 👥 Total Users: ${user.data.length}*
*│*\n`

            for (const i of user.data) {
              message += `*│ 👤 ${i.attributes.username}*\n`
              message += `*│* • ID: ${i.attributes.id}\n`
              message += `*│* • UUID: ${i.attributes.uuid}\n`
              message += `*│* • Admin: ${i.attributes.root_admin ? "Yes ✓" : "No ✗"}\n`
              message += `*│*\n`
            }

            message += `*╰───────────────────────────╯*`

            await sock.sendMessage(m.cht, { text: message, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "listadmin":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)

          const { key } = await sock.sendMessage(m.cht, { text: "🔍 Fetching admins..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/users?page=1", {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const user = await f.json()
            let totaladmin = 0
            let message = `*╭─────❲ ADMIN LIST ❳─────╮*\n*│*\n`

            for (const i of user.data) {
              if (i.attributes.root_admin === true) {
                totaladmin++
                message += `*│ 👑 ${i.attributes.username}*\n`
                message += `*│* • ID: ${i.attributes.id}\n`
                message += `*│* • UUID: ${i.attributes.uuid}\n`
                message += `*│* • Email: ${i.attributes.email}\n`
                message += `*│*\n`
              }
            }

            if (totaladmin === 0) {
              message += `*│ No admins found*\n*│*\n`
            } else {
              message = message.replace("ADMIN LIST", `ADMIN LIST (${totaladmin})`)
            }

            message += `*╰───────────────────────────╯*`

            await sock.sendMessage(m.cht, { text: message, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "detusr":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id user]*`

          const { key } = await sock.sendMessage(m.cht, { text: "🔍 Searching user..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/users/" + text, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            if (data.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ USER NOT FOUND*", edit: key }, { quoted: m })

            const user = data.attributes

            const cap = `*╭─────❲ USER DETAILS ❳─────╮*
*│*
*│ 👤 ${user.username.toUpperCase()}*
*│* • Email: ${user.email}
*│* • ID: ${user.id}
*│* • UUID: ${user.uuid}
*│* • First Name: ${user.first_name}
*│* • Last Name: ${user.last_name}
*│* • Admin: ${user.root_admin ? "Yes ✓" : "No ✗"}
*│* • Created: ${await tanggal(user.created_at)}
*│* • Updated: ${await tanggal(user.updated_at)}
*│*
*╰───────────────────────────╯*`

            await sock.sendMessage(m.cht, { text: cap, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "delusr":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id user]*`

          const { key } = await sock.sendMessage(m.cht, { text: "🗑️ Deleting user..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/users/" + text, {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const res = f.ok ? { errors: null } : await f.json()

            if (res.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ USER NOT FOUND*", edit: key }, { quoted: m })

            await sock.sendMessage(m.cht, { text: "*✅ USER DELETED SUCCESSFULLY*", edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "delsrv":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`

          const { key } = await sock.sendMessage(m.cht, { text: "🗑️ Deleting server..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/servers/" + text, {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const res = f.ok ? { errors: null } : await f.json()

            if (res.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ SERVER NOT FOUND*", edit: key }, { quoted: m })

            await sock.sendMessage(m.cht, { text: "*✅ SERVER DELETED SUCCESSFULLY*", edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "detsrv":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`

          const { key } = await sock.sendMessage(m.cht, { text: "🔍 Searching server..." }, { quoted: m })

          try {
            // Get server details
            const f = await fetch(config.cpanel.domain + "/api/application/servers/" + text, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            if (data.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ SERVER NOT FOUND*", edit: key }, { quoted: m })

            const s = data.attributes

            // Get server utilization
            const f2 = await fetch(config.cpanel.domain + "/api/client/servers/" + text + "/resources", {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const utilData = await f2.json()
            const util = utilData.attributes || { current_state: "unknown" }

            const cap = `*╭─────❲ SERVER DETAILS ❳─────╮*
*│*
*│ 🖥️ ${s.name.toUpperCase()}*
*│* • ID: ${s.id}
*│* • UUID: ${s.uuid}
*│* • Description: ${s.description}
*│* • Status: ${getStatusEmoji(util.current_state)} ${util.current_state || "Unknown"}
*│*
*│ 📊 RESOURCES*
*│* • Memory: ${s.limits.memory === 0 ? "Unlimited" : s.limits.memory + "MB"}
*│* • Disk: ${s.limits.disk === 0 ? "Unlimited" : s.limits.disk + "MB"}
*│* • CPU: ${s.limits.cpu === 0 ? "Unlimited" : s.limits.cpu + "%"}
*│*
*│ 📅 DATES*
*│* • Created: ${await tanggal(s.created_at)}
*│* • Updated: ${await tanggal(s.updated_at)}
*│*
*╰───────────────────────────╯*`

            await sock.sendMessage(m.cht, { text: cap, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "listsrv":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          const txt = text ? text : 1

          const { key } = await sock.sendMessage(m.cht, { text: "🔍 Fetching servers..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/servers?page=" + txt, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            let message = `*╭─────❲ SERVER LIST ❳─────╮*
*│*
*│ 🖥️ Total Servers: ${data.data.length}*
*│*\n`

            for (const i of data.data) {
              message += `*│ 🔹 ${i.attributes.name}*\n`
              message += `*│* • ID: ${i.attributes.id}\n`
              message += `*│* • UUID: ${i.attributes.uuid}\n`
              message += `*│* • Memory: ${i.attributes.limits.memory === 0 ? "Unlimited" : i.attributes.limits.memory + "MB"}\n`
              message += `*│* • Disk: ${i.attributes.limits.disk === 0 ? "Unlimited" : i.attributes.limits.disk + "MB"}\n`
              message += `*│* • CPU: ${i.attributes.limits.cpu === 0 ? "Unlimited" : i.attributes.limits.cpu + "%"}\n`
              message += `*│*\n`
            }

            message += `*╰───────────────────────────╯*`

            await sock.sendMessage(m.cht, { text: message, edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "reinstall":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`

          const { key } = await sock.sendMessage(m.cht, { text: "🔄 Reinstalling server..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/servers/" + text + "/reinstall", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            if (data.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ SERVER NOT FOUND*", edit: key }, { quoted: m })

            await sock.sendMessage(
              m.cht,
              { text: "*✅ SERVER REINSTALLATION INITIATED*\nThe server will be reinstalled shortly.", edit: key },
              { quoted: m },
            )
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "suspend":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`

          const { key } = await sock.sendMessage(m.cht, { text: "⏸️ Suspending server..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/servers/" + text + "/suspend", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            if (data.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ SERVER NOT FOUND*", edit: key }, { quoted: m })

            await sock.sendMessage(m.cht, { text: "*✅ SERVER SUSPENDED SUCCESSFULLY*", edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "unsuspend":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`

          const { key } = await sock.sendMessage(m.cht, { text: "▶️ Unsuspending server..." }, { quoted: m })

          try {
            const f = await fetch(config.cpanel.domain + "/api/application/servers/" + text + "/unsuspend", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
            })

            const data = await f.json()
            if (data.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ SERVER NOT FOUND*", edit: key }, { quoted: m })

            await sock.sendMessage(m.cht, { text: "*✅ SERVER UNSUSPENDED SUCCESSFULLY*", edit: key }, { quoted: m })
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break

      case "startsrv":
      case "stopsrv":
      case "restartsrv":
        {
          if (!m.isOwner) return m.reply(config.messages.owner)
          if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`

          const action = m.command.replace("srv", "")
          const actionEmoji = action === "start" ? "▶️" : action === "stop" ? "⏹️" : "🔄"
          const actionText = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()

          const { key } = await sock.sendMessage(
            m.cht,
            { text: `${actionEmoji} ${actionText}ing server...` },
            { quoted: m },
          )

          try {
            const f = await fetch(config.cpanel.domain + "/api/client/servers/" + text + "/power", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.cpanel.apikey,
              },
              body: JSON.stringify({
                signal: action,
              }),
            })

            const data = await f.json()
            if (data.errors)
              return await sock.sendMessage(m.cht, { text: "*❌ SERVER NOT FOUND*", edit: key }, { quoted: m })

            await sock.sendMessage(
              m.cht,
              { text: `*✅ SERVER ${actionText.toUpperCase()}ED SUCCESSFULLY*`, edit: key },
              { quoted: m },
            )
          } catch (error) {
            await sock.sendMessage(m.cht, { text: `❌ Error: ${error.message}`, edit: key }, { quoted: m })
          }
        }
        break
    }
  },
}

