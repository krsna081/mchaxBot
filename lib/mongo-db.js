// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = class MongoDB {
  constructor(url) {
    this.url = url;
    this.data = this._data = this._schema = this._model = {};
    this.db;
  }

  async connect() {
    try {
      this.db = await mongoose.connect(this.url); // ✅ Hapus opsi deprecated
      this.connection = mongoose.connection;
      console.log("✅ MongoDB Connected Successfully!");
      return this.db;
    } catch (error) {
      console.error("❌ MongoDB Connection Failed:", error);
      throw error;
    }
  }

  async read() {
    try {
      if (!this.db) await this.connect(); // ✅ Pastikan koneksi sudah ada

      let schema = this._schema = new Schema({
        data: {
          type: Object,
          required: true,
          default: {}, // ✅ Pastikan data awal tidak null
        },
      });

      try {
        this._model = mongoose.model("data", schema);
      } catch {
        this._model = mongoose.model("data");
      }

      this._data = await this._model.findOne({});

      if (!this._data) {
        console.log("⚠️ No data found, creating a new entry...");
        this.data = {};
        this._data = await this._model.create({ data: this.data }); // ✅ Perbaiki jika data awal kosong
      } else {
        this.data = this._data.data;
      }

      return this.data;
    } catch (error) {
      console.error("❌ Error reading data:", error);
      throw error;
    }
  }

  async write(data) {
    try {
      if (!data) return data;

      if (!this._data) {
        console.log("⚠️ No existing data found, creating new...");
        this._data = await this._model.create({ data }); // ✅ Buat data baru jika belum ada
      } else {
        this._data.data = data;
        await this._data.save(); // ✅ Simpan perubahan ke database
      }

      return this._data;
    } catch (error) {
      console.error("❌ Error writing data:", error);
      throw error;
    }
  }
};