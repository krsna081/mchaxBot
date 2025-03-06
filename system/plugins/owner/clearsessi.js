const fs = require("fs");
const path = require("path");

let mchax = async (m, { sock, Func, Scraper, Uploader, store, text, config }) => {
  const directory = "./sessions";
  const sampah = [];

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Terjadi kesalahan:", err);
      return;
    }

    files.forEach((file) => {
      // Cek apakah file adalah creds.json atau berawalan app-state, jika iya maka skip
      if (file === "creds.json" || file.startsWith("app-state")) return;

      const filePath = path.join(directory, file);
      sampah.push(file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file:", err);
          return;
        }
      });
    });

    m.reply(`Berhasil menghapus ${sampah.length} file sampah.`);
  });
};

mchax.command = "clearsessi";
mchax.alias = ["csessi"];
mchax.category = ["owner"];
mchax.settings = { owner: true };
mchax.description = "";
mchax.loading = true;

module.exports = mchax;