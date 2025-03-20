const fs = require("fs");

module.exports = {
    command: "",
    alias: [
"addsrv",
"addusr",
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
    loading: true,
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
  sock.panel = sock.panel || {};
  const users = db.list().user[m.sender];
  const saldo = `*• Your Saldo :* ${Func.formatNumber(users.saldo)}`;
  const startup_cmd = "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then \/usr\/local\/bin\/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then \/usr\/local\/bin\/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f \/home\/container\/package.json ]; then \/usr\/local\/bin\/npm install; fi;  if [[ ! -z ${CUSTOM_ENVIRONMENT_VARIABLES} ]]; then      vars=$(echo ${CUSTOM_ENVIRONMENT_VARIABLES} | tr \";\" \"\\n\");      for line in $vars;     do export $line;     done fi;  \/usr\/local\/bin\/${CMD_RUN};";
  switch (m.command) {
    case "pannel":
      {
        m.reply(`*± L I S T - P A N N E L*

* 1GB Disk / 50 Cpu = Rp: 2.000
* 2GB Disk / 100 Cpu = Rp: 3.000
* 3GB Disk / 150 Cpu = Rp: 4.000
* 4GB Disk / 200 Cpu = Rp: 5.000
* 5GB Disk / 250 Cpu = Rp: 6.000
* 6GB Disk / 300 Cpu = Rp: 7.000
* 7GB Disk / 350 Cpu = Rp: 8.000
* 8GB Disk / 400 Cpu = Rp: 9.000
* 9GB Disk / 450 Cpu = Rp: 10.000
* 10GB Disk / 500 Cpu = Rp: 12.000
* ∞ Disk / ∞ Cpu = Rp: 15.000

*Benefits Buying ✍️ :*
- Server Fresh anti lemot ✓
- Server Uptime 24 jam ✓
- Garansi 15D ✓
- Script  terjaga ✓
- No Boros Kouta/Storage ✓
- Simple ✓`);
      }
      break;
    case "addusr":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        let t = text.split(",");
        if (t.length < 3)
          return m.reply(
            `*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`,
          );
        let username = t[0];
        let u = m.quoted
          ? m.quoted.sender
          : t[1]
            ? t[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            : m.mentions[0];
        let statusInput = t[2].trim().toLowerCase();
        let status;
        if (statusInput === "true" || statusInput === "y") {
          status = true;
        } else if (statusInput === "false" || statusInput === "n") {
         status = false;
        } else {
         return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`);
        }
        let name = username;
        let email = username + "@gmail.com";        
        if (!u) return;
        let d = (await sock.onWhatsApp(u.split`@`[0]))[0] || {};
        let password = d.exists ? Func.makeId(8) : t[3];
        let f = await fetch(config.cpanel.domain + "/api/application/users", {
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
        });
        let data = await f.json();
        if (data.errors)
          return m.reply(JSON.stringify(data.errors[0], null, 2));
        let user = data.attributes;
        let { key } = await sock.sendMessage(
          m.cht,
          { text: "Creating User..." },
          { quoted: m },
        );
let ctf;
if (status === true) {
    ctf = `*± P T R O D A C T Y L - P A N E L*

*• Account Info :*
* *Email :* ${user.email}
* *ID :* ${user.id}
* *Admin :* ${user.root_admin ? "yes" : "no"}
* *Create :* ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}
-------------------------------------------------------------------------------------
*• Rules For Admin :*
* Jangan curi script
* Dilarang Delete server&user
* No create admin!

\`\`\`Taati semua rules yang tersedia. Melanggar rules? kick no reff, maksa reff block!\`\`\``;
} else {
    ctf = `*± P T R O D A C T Y L - P A N E L*

*• Account Info :*
* *Email :* ${user.email}
* *ID :* ${user.id}
* *Admin :* ${user.root_admin ? "yes" : "no"}
* *Create :* ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}
-------------------------------------------------------------------------------------
\`\`\`Jangan hilangkan data panel anda, simpan history chat ini sebagai bukti claim garansi jika server mati/down\`\`\``;
}
        let cap = `*[ Success Creating User ]*
*• Admin :* ${user.root_admin ? "yes" : "no"}
*• Create :* ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}

\`\`\`Account information has been sent to that number!\`\`\``;
         await sock.sendMessage(m.cht, { text: cap, edit: key }, { quoted: m });
let cok = await sock.sendMessage(u, { text: ctf });
sock.sendMessage(u, { text: `- Login: ${config.cpanel.domain}\n- User: ${user.username}\n- Pw: ${password.toString()}` }, { quoted: cok });
        }
      break
    case "addsrv":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        let t = text.split(",");
        if (t.length < 5)
          return m.reply(
            `*• Example :* ${m.prefix + m.command} *[name, number, userid, memo/disk, cpu]*`,
          );
        let name = t[0];
        let u = m.quoted
          ? m.quoted.sender
          : t[1]
            ? t[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            : m.mentions[0];  
        let user_id = t[2];
        let memo_disk = t[3].split("/");
        let cpu = t[4];
        let f2 = await fetch(config.cpanel.domain + "/api/application/nests/" + config.cpanel.nets + "/eggs/" + config.cpanel.egg, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        });
        let data2 = await f2.json();
        let f3 = await fetch(config.cpanel.domain + "/api/application/servers", {
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
            egg: parseInt(config.cpanel.egg),
            docker_image: data2.attributes.docker_image,
            startup: startup_cmd,
            environment: {
              INST: "npm",
              USER_UPLOAD: 0,
              AUTO_UPDATE: 0,
              CMD_RUN: "npm start",
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
              locations: [parseInt(1)],
              dedicated_ip: false,
              port_range: [],
            },
          }),
        });
        let res = await f3.json();
        if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2));
        let server = res.attributes;
        let { key } = await sock.sendMessage(
          m.cht,
          { text: "Creating Server..." },
          { quoted: m },
        );                
        ctf = `*± P T R O D A C T Y L - P A N E L*

*• Account Info :*
* *Name :* ${server.name}        
* *ID :* ${server.id}
* *Memory :* ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory + "Mb"}
* *Disk :* ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk + "Mb"}
* *Cpu :* ${server.limits.cpu === 0 ? "Unlimited" : server.limits.cpu + "%"}
* *Create :* ${server.created_at}
-------------------------------------------------------------------------------------
\`\`\`Jangan hilangkan data panel anda, simpan history chat ini sebagai bukti claim garansi jika server mati/down\`\`\``;
        sock.sendMessage(u,
          {
            text: ctf
          },
          {
           quoted: config.quoted.fkontak
          }
        );
        let p = `*[ Success Creating Server ]*
*• Memory :* ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory + "Mb"}
*• Disk :* ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk + "Mb"}
*• Cpu :* ${server.limits.cpu === 0 ? "Unlimited" : server.limits.cpu + "%"}
*• Create :* ${server.created_at}

\`\`\`Account information has been sent to that number!\`\`\``;
        await sock.sendMessage(m.cht, { text: p, edit: key }, { quoted: m });
      }
break
case "cpanel": case "addpanel": case "buatpanel": {

    let t = text.split(",");
    if (t.length < 3) {
        return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`);
    }
    let [username, number, statusInput] = t.map(i => i.trim());

    let status;
    if (statusInput === "true" || statusInput === "y") {
        if (!m.isOwner) {
            return m.reply(`*• Failed! Only owner can set status to admin (true).*`);
        }
        status = true;
    } else if (statusInput === "false" || statusInput === "n") {
        status = false;
    } else {
        return m.reply(`*• Example :* ${m.prefix + m.command} *[username, number, true/false]*`);
    }

    let existingBuyer = Object.values(sock.panel).find(panel => panel.buyer === username);
    if (existingBuyer) {
        return m.reply(`*[ System Detected ]* Buyer with username "${username}" already exists!`);
    }

    sock.panel[m.sender] = {
        buyer: username,
        client: number,
        admin: status,
    };

    let message = `Please create your panel server in the following way\n• 1Gb Ram: ${m.prefix}cp1gb\n\n`;
    message += "*B E S T - R A M*\n";
    message += "- Unli: Unli Ram/Unli Cpu (`cpunli`)\n\n";
    message += "*L O W - R A M*\n";
    message += "- 1Gb: 1Gb Ram/50 Cpu (`cp1gb`)\n";
    message += "- 2Gb: 2Gb Ram/100 Cpu (`cp2gb`)\n";
    message += "- 3Gb: 3Gb Ram/150 Cpu (`cp3gb`)\n";
    message += "- 4Gb: 4Gb Ram/200 Cpu (`cp4gb`)\n";
    message += "- 5Gb: 5Gb Ram/250 Cpu (`cp5gb`)\n\n";
    message += "*H I G H - R A M*\n";
    message += "- 6Gb: 6Gb Ram/300 Cpu (`cp6gb`)\n";
    message += "- 7Gb: 7Gb Ram/350 Cpu (`cp7gb`)\n";
    message += "- 8Gb: 8Gb Ram/400 Cpu (`cp8gb`)\n";
    message += "- 9Gb: 9Gb Ram/450 Cpu (`cp9gb`)\n";
    message += "- 10Gb: 10Gb Ram/500 Cpu (`cp10gb`)";

    m.reply(message);
    break;
}
break;
case "cp1gb": case "cp2gb": case "cp3gb": case "cp4gb": case "cp5gb": case "cp6gb": case "cp7gb": case "cp8gb": case "cp9gb": case "cp10gb": case "cpunli": {
    if (!sock.panel[m.sender]) {
        return m.reply(`*[ System Notice ]* username not found or session has expired\n\n*• Example :* ${m.prefix}cpanel ${m.pushName},${m.sender.split("@")[0]},n`);
    }
    
    var ram, disknya, cpu, saldoRequired;
    
    switch (m.command) {
        case "cp1gb": ram = "1125"; disknya = "1125"; cpu = "50"; saldoRequired = 2000; break;
        case "cp2gb": ram = "2125"; disknya = "2125"; cpu = "100"; saldoRequired = 3000; break;
        case "cp3gb": ram = "3125"; disknya = "3125"; cpu = "150"; saldoRequired = 4000; break;
        case "cp4gb": ram = "4125"; disknya = "4125"; cpu = "200"; saldoRequired = 5000; break;
        case "cp5gb": ram = "5125"; disknya = "5125"; cpu = "250"; saldoRequired = 6000; break;
        case "cp6gb": ram = "6125"; disknya = "6125"; cpu = "300"; saldoRequired = 7000; break;
        case "cp7gb": ram = "7125"; disknya = "7125"; cpu = "350"; saldoRequired = 8000; break;
        case "cp8gb": ram = "8125"; disknya = "8125"; cpu = "400"; saldoRequired = 9000; break;
        case "cp9gb": ram = "9124"; disknya = "9125"; cpu = "450"; saldoRequired = 10000; break;
        case "cp10gb": ram = "10125"; disknya = "10125"; cpu = "500"; saldoRequired = 12000; break;
        default: ram = "0"; disknya = "0"; cpu = "0"; saldoRequired = 15000; break;
    }

    if (users.saldo < saldoRequired) {
        let cap = `You must have at least a balance of *${Func.formatNumber(saldoRequired)}*
Your balance *[ ${Func.formatNumber(users.saldo)} ]* is insufficient, do you want to top up your balance?`;
        return m.reply(cap);
    } else {
        let username = sock.panel[m.sender].buyer;
        let u = sock.panel[m.sender].client.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        let name = username;
        let admin = sock.panel[m.sender].admin;
        let email = username + "@gmail.com";
        if (!u) return;
        let d = (await sock.onWhatsApp(u.split`@`[0]))[0] || {};
        let password = d.exists ? Func.makeId(8) : Func.makeId(4);
        let f = await fetch(config.cpanel.domain + "/api/application/users", {
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
        });
        let data = await f.json();
        if (data.errors)
          return m.reply(JSON.stringify(data.errors[0], null, 2));
        let user = data.attributes;
        let f2 = await fetch(config.cpanel.domain + "/api/application/nests/" + config.cpanel.nets + "/eggs/" + config.cpanel.egg, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        });
        let { key } = await sock.sendMessage(
          m.cht,
          { text: "Creating Server..." },
          { quoted: m },
        );
        let data2 = await f2.json();

        let f3 = await fetch(config.cpanel.domain + "/api/application/servers", {
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
            egg: parseInt(config.cpanel.egg),
            docker_image: data2.attributes.docker_image,
            startup: startup_cmd,
            environment: {
              INST: "npm",
              USER_UPLOAD: 0,
              AUTO_UPDATE: 0,
              CMD_RUN: "npm start",
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
              locations: [parseInt(1)],
              dedicated_ip: false,
              port_range: [],
            },
          }),
        });
        let res = await f3.json();
        if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2));
        let server = res.attributes;
        users.saldo -= parseInt(saldoRequired);
        delete sock.panel[m.sender];
        let p = `Pembelian panel berhasil
Total saldo kamu saat ini : *[ ${Func.formatNumber(users.saldo)} ]*

\`\`\`Account information has been sent to that number!\`\`\``;
        await sock.sendMessage(m.cht, { text: p, edit: key }, { quoted: m });
let ctf = `*± P T R O D A C T Y L - P A N E L*

*• Account Info :*
* *Name :* ${server.name}        
* *ID :* ${server.id}
* *Memory :* ${server.limits.memory === 0 ? "Unlimited" : server.limits.memory + "Mb"}
* *Disk :* ${server.limits.disk === 0 ? "Unlimited" : server.limits.disk + "Mb"}
* *Cpu :* ${server.limits.cpu === 0 ? "Unlimited" : server.limits.cpu + "%"}
* *Create :* ${server.created_at}
-------------------------------------------------------------------------------------
\`\`\`Jangan hilangkan data panel anda, simpan history chat ini sebagai bukti claim garansi jika server mati/down\`\`\``;
let cok = await sock.sendMessage(u, { text: ctf });
sock.sendMessage(u, { text: `- Login: ${config.cpanel.domain}\n- User: ${user.username}\n- Pw: ${password.toString()}` }, { quoted: cok });
    }
}
      break;
    case "listusr":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        let txt = text ? text : 1;
        let f = await fetch(config.cpanel.domain + "/api/application/users?page=" + txt, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        });
        let user = await f.json();
        let message = `Total User Panel today : *[ ${user.data.length} ]*\n\n`;

        for (let i of user.data) {
         message += `👤 NAME: ${i.attributes.username}\n`;
         message += `   - ID: ${i.attributes.id}\n`;
         message += `   - UUID: ${i.attributes.uuid}\n\n`;
       }
        m.reply(message);        
      }
      break;
    case "listadmin":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        let txt = text ? text : 1;
        let f = await fetch(config.cpanel.domain + "/api/application/users?page=1", {
         method: "GET",
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json",
           Authorization: "Bearer " + config.cpanel.apikey,
         },
      });
      let user = await f.json();
      let totaladmin = 0;
      let message = ``

        for (let i of user.data) {
          if (i.attributes.root_admin === true) {        
            message += `👤 NAME: ${i.attributes.username}\n`;
            message += `   - ID: ${i.attributes.id}\n`;
            message += `   - UUID: ${i.attributes.uuid}\n\n`;
       }
       if (totaladmin === 0) {
        return m.reply("Tidak ada admin yang ditemukan.");
       }
       message = `Total Admin Panel today : *[ ${totaladmin} ]*\n\n` + message;
       m.reply(message);
       }
      }
      break;
    case "detusr":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        if (!text) throw `*• Example :* ${m.prefix + m.command} *[id user]*`;
        let { key } = await sock.sendMessage(m.cht, { text: "Searching..." }, { quoted: m });
        let f = await (
          await fetch(config.cpanel.domain + "/api/application/users/" + text, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + config.cpanel.apikey,
            },
          })
        ).json();
        if (f.errors) return await sock.sendMessage(m.cht, { text: "*[ User Not Found ]*", edit: key }, { quoted: m });
        let user = f.attributes;
        let cap = `*[ Detail User ${user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()} ]*
*• Email :* ${user.email}
*• Username :* ${user.username}
*• ID :* ${user.id}
*• UUID :* *[ ${user.uuid} ]*
*• First Name :* ${user.first_name}
*• Last Name :* ${user.last_name}
*• Admin :* ${user.root_admin ? "yes" : "no"}
*• Create :* ${await require("moment-timezone")().tz("Asia/Jakarta").format("DD/MM/YYYY")}
*• Upadate :* ${await tanggal(user.updated_at)}`;
      m.reply(cap);
      }
      break;
    case "delusr":
      {
    if (!m.isOwner) return m.reply(config.messages.owner);
    if (!text) throw `*• Example :* ${m.prefix + m.command} *[id user]*`;
    let { key } = await sock.sendMessage(m.cht, { text: "Deleting..." }, { quoted: m });    
        let f = await fetch(config.cpanel.domain + "/api/application/users/" + text, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        });
        let res = f.ok
          ? {
              errors: null,
            }
          : await f.json();
        if (res.errors) return await sock.sendMessage(m.cht, { text: "*[ There Are No Users ]*", edit: key }, { quoted: m });
        await sock.sendMessage(m.cht, { text: "*[ Successfully Deleting User ]*", edit: key }, { quoted: m });
      }
      break;
    case "delsrv":
      {
    if (!m.isOwner) return m.reply(config.messages.owner);
    if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`;
    let { key } = await sock.sendMessage(m.cht, { text: "Deleting..." }, { quoted: m });    
        let f = await fetch(config.cpanel.domain + "/api/application/servers/" + text, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        });
        let res = f.ok
          ? {
              errors: null,
            }
          : await f.json();
        if (res.errors) return await sock.sendMessage(m.cht, { text: "*[ There Are No Servers ]*", edit: key }, { quoted: m });
        await sock.sendMessage(m.cht, { text: "*[ Successfully Deleting Server ]*", edit: key }, { quoted: m });
      }
      break;
    case "detsrv":
      {
    if (!m.isOwner) return m.reply(config.messages.owner);
    if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`;
    let { key } = await sock.sendMessage(m.cht, { text: "Searching..." }, { quoted: m });
        let f = await (
          await fetch(config.cpanel.domain + "/api/application/servers/" + text, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + config.cpanel.apikey,
            },
          })
        ).json();
        if (f.errors) return await sock.sendMessage(m.cht, { text: "*[ Server Not Found ]*", edit: key }, { quoted: m });
        let s = f.attributes;
        let cap = `*[ Detail Servers ${s.name.charAt(0).toUpperCase() + s.name.slice(1).toLowerCase()} ]*
*• Name :* ${s.name}        
*• ID :* ${s.id}
*• Desc :* ${s.description}
*• UUID :* *[ ${s.uuid} ]*
*• Memory :* ${s.limits.memory === 0 ? "Unlimited" : s.limits.memory + "Mb"}
*• Disk :* ${s.limits.disk === 0 ? "Unlimited" : s.limits.disk + "Mb"}
*• Cpu :* ${s.limits.cpu === 0 ? "Unlimited" : s.limits.cpu + "%"}
*• Create :* ${await tanggal(s.created_at)}
*• Update :* ${await tanggal(s.updated_at)}`
      m.reply(cap);
      }
      break;
    case "listsrv":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        let txt = text ? text : 1;
        let f = await fetch(config.cpanel.domain + "/api/application/servers?page=" + txt, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        });
        let user = await f.json();
        let message = `Total Servers Panel today : *[ ${user.data.length} ]*\n\n`;

        for (let i of user.data) {
         message += `👤 NAME: ${i.attributes.name}\n`;
         message += `   - ID: ${i.attributes.id}\n`;
         message += `   - UUID: ${i.attributes.uuid}\n\n`;
       }
        m.reply(message);
       }
      break;
    case "reinstall":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`;
        let { key } = await sock.sendMessage(m.cht, { text: "Reinstalling..." }, { quoted: m });
        let f = await (
        await fetch(config.cpanel.domain + "/api/application/servers/" + text + "/reinstall", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        })
        ).json();
        if (f.errors) return await sock.sendMessage(m.cht, { text: "*[ Server Not Found ]*", edit: key }, { quoted: m });
        await sock.sendMessage(m.cht, { text: "*[ Reinstalling The Server ]*", edit: key }, { quoted: m });
      }
      break;
    case "suspend":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`;
        let { key } = await sock.sendMessage(m.cht, { text: "Suspending..." }, { quoted: m }); 
        let f = await (
        await fetch(config.cpanel.domain + "/api/application/servers/" + text + "/suspend", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        })
        ).json();
        if (f.errors) return await sock.sendMessage(m.cht, { text: "*[ Server Not Found ]*", edit: key }, { quoted: m });
        await sock.sendMessage(m.cht, { text: "*[ Suspending The Server ]*", edit: key }, { quoted: m });
      }
      break;
    case "unsuspend":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`;
        let { key } = await sock.sendMessage(m.cht, { text: "Unsuspending..." }, { quoted: m });
        let f = await (
        await fetch(config.cpanel.domain + "/api/application/servers/" + text + "/unsuspend", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
        })
        ).json();
        if (f.errors) return await sock.sendMessage(m.cht, { text: "*[ Server Not Found ]*", edit: key }, { quoted: m });
        await sock.sendMessage(m.cht, { text: "*[ Unsuspending The Server ]*", edit: key }, { quoted: m });
      }
      break;
    case "startsrv":
    case "stopsrv":
    case "restartsrv":
      {
        if (!m.isOwner) return m.reply(config.messages.owner);
        if (!text) throw `*• Example :* ${m.prefix + m.command} *[id server]*`;
        let action = command.replace('srv', '')
        let { key } = await sock.sendMessage(m.cht, { text: `${action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}` }, { quoted: m });
        let f = await (
        await fetch(config.cpanel.domain + "/api/client/servers/" + text + "/power", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.cpanel.apikey,
          },
          body: JSON.stringify({
          signal: action
         })
        })
        ).json(); 
        if (f.errors) return await sock.sendMessage(m.cht, { text: "*[ Server Not Found ]*", edit: key }, { quoted: m });
        await sock.sendMessage(m.cht, { text: `*[ ${action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()} The Server ]*`, edit: key }, { quoted: m });
      }
      break;
    }
  }
}