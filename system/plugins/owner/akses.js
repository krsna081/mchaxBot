// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

const GITHUB_OWNER = "krsna081"; // Ganti dengan username GitHub kamu
const REPO_NAME = "data-mchax"; // Nama repository
const FILE_PATH = "key.json"; // Path file JSON di repository
const TOKEN = "tokenkalian"; // Token GitHub

async function getGitHubFile() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const content = Buffer.from(response.data.content, "base64").toString("utf-8");
        return {
            data: JSON.parse(content),
            sha: response.data.sha
        };
    } catch (error) {
        console.error("Gagal mengambil file dari GitHub:", error.response?.data || error.message);
        return null;
    }
}

async function updateGitHubFile(updatedData, sha) {
    try {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const content = Buffer.from(JSON.stringify(updatedData, null, 2)).toString("base64");

        await axios.put(url, {
            message: "Update user data via bot",
            content,
            sha
        }, {
            headers: {
                Authorization: `token ${TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        return true;
    } catch (error) {
        console.error("Gagal memperbarui file di GitHub:", error.response?.data || error.message);
        return false;
    }
}

let mchax = async (m, { sock }) => {
    if (!m.args.length) {
        // **Jika hanya "akses", tampilkan daftar pengguna**
        let githubData = await getGitHubFile();
        if (!githubData) {
            return m.reply("Gagal mengambil data dari GitHub!");
        }

        let { data } = githubData;

        if (data.length === 0) {
            return m.reply("⚠️ Tidak ada pengguna yang terdaftar!");
        }

        let userList = data.map((user, index) => `🔹 *${index + 1}*. User: ${user.user}\n   ├ 🔑 PW: ${user.pw}\n   └ 👑 Owner: ${user.owner}`).join("\n\n");

        return m.reply(`📜 *Daftar Pengguna Terdaftar:*\n\n${userList}`);
    }

    let command = m.args[0];
    if (!["--add", "--delete"].includes(command)) {
        return m.reply("Gunakan --add atau --delete!");
    }

    if (m.args.length < 2) {
        return m.reply("Format salah! Gunakan:\n\nakses --add owner user pw\nakses --delete owner user pw");
    }

    let [owner, user, pw] = m.args.slice(1).map(a => a.trim());

    let githubData = await getGitHubFile();
    if (!githubData) {
        return m.reply("Gagal mengambil data dari GitHub!");
    }

    let { data, sha } = githubData;

    if (command === "--add") {
        if (data.some(entry => entry.user === user)) {
            return m.reply("User sudah ada dalam database!");
        }

        data.push({ user, pw, owner });

        if (await updateGitHubFile(data, sha)) {
            return m.reply(`✅ User ${user} berhasil ditambahkan!`);
        } else {
            return m.reply("❌ Gagal menambahkan user!");
        }
    }

    if (command === "--delete") {
        let index = data.findIndex(entry => entry.user === user && entry.pw === pw);
        if (index === -1) {
            return m.reply("User tidak ditemukan!");
        }

        data.splice(index, 1);

        if (await updateGitHubFile(data, sha)) {
            return m.reply(`✅ User ${user} berhasil dihapus!`);
        } else {
            return m.reply("❌ Gagal menghapus user!");
        }
    }
};

mchax.command = "akses";
mchax.alias = [];
mchax.category = ["owner"];
mchax.settings = { owner: true };
mchax.description = "Menambah/menghapus/list pengguna.";
mchax.loading = false;

module.exports = mchax;