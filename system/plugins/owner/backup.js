// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

module.exports = {
    command: "backup",
    alias: ["bakcup"],
    category: ["owner"],
    settings: {
        owner: true
    },
    description: "Membuat backup kode bot tanpa menyertakan folder yang tidak diperlukan",
    loading: false,
    async run(m, {
        sock
    }) {
        try {
            const backupDir = path.join(process.cwd(), '/tmp');
            if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

            const timestamp = new Date();
            const formattedDate = timestamp.toISOString().replace(/[:.]/g, '-').split('T')[0]; // YYYY-MM-DD
            const backupFileName = `backup_${formattedDate}.zip`;
            const backupFilePath = path.join(backupDir, backupFileName);

            const output = fs.createWriteStream(backupFilePath);
            const archive = archiver('zip', {
                zlib: {
                    level: 9
                }
            });

            output.on('close', async () => {
                let stats = fs.statSync(backupFilePath);
                let fileSizeInKB = stats.size / 1024;
                let fileSize = fileSizeInKB >= 1024 ?
                    `${(fileSizeInKB / 1024).toFixed(2)} MB` :
                    `${fileSizeInKB.toFixed(2)} KB`;

                const caption = `> *– 乂 Backup Script Selesai!*\n\n` +
                    `> 📂 *Nama File:* ${backupFileName}\n` +
                    `> 📆 *Tanggal:* ${formattedDate}\n` +
                    `> 📦 *Ukuran:* ${fileSize}`;

                await sock.sendMessage(m.cht, {
                    document: fs.readFileSync(backupFilePath),
                    mimetype: 'application/zip',
                    fileName: backupFileName,
                    caption
                }, {
                    quoted: m
                });

                fs.unlinkSync(backupFilePath);
            });

            archive.on('error', err => {
                throw err;
            });

            archive.pipe(output);

            const excludeDirs = ['node_modules', '.pm2', '.npm', '.cache', 'sessions'];
            const excludeFiles = ['package-lock.json', 'neko-db.json'];

            function addDirectory(src, base = '') {
                const items = fs.readdirSync(src);
                for (const item of items) {
                    const fullPath = path.join(src, item);
                    const relativePath = path.join(base, item);

                    if (excludeDirs.includes(item) || excludeFiles.includes(item)) continue;

                    const stats = fs.statSync(fullPath);
                    if (stats.isDirectory()) {
                        addDirectory(fullPath, relativePath);
                    } else {
                        archive.file(fullPath, {
                            name: relativePath
                        });
                    }
                }
            }

            addDirectory(path.join(process.cwd()));
            archive.finalize();

            m.reply('> ⏳ *Membuat backup*');
        } catch (err) {
            m.reply(`> ❌ *Backup gagal:* ${err.message}`);
        }
    },
};