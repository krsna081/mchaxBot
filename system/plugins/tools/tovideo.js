module.exports = {
    command: "tovideo",
    alias: ["tovid", "togif", "toptv"],
    category: ["tools"],
    settings: {},
    description: "Mengubah sticker menjadi video",
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (/webp/.test(mime) || /ptv/.test(mime) || q.isAnimated) {
            let buf = await q.download()
            let anu = /ptv/.test(mime) ? buf : await converter(buf)
            await sock.sendMessage(m.cht, {
               video: anu,
               gifPlayback: /gif/i.test(m.command),
               ptv: /ptv/i.test(m.command),
               gifAttribution: Math.floor(Math.random() * 2) + 1
            }, {
               caption: '',
               quoted: m
            })
         } else return m.reply(`🚩 Balas stiker yang ingin Anda ubah menjadi video/gif (tidak mendukung stiker biasa, harus stiker bergerak).`);
      } catch (e) {
         throw e;
      }
   },
}

const fs = require('fs')
const util = require('util')
const { exec } = require('child_process')
const execPromise = util.promisify(exec)
const converter = async (bufferImage) => {
   try {
      let pathFile = './tmp/' + ~~(Math.random() * 1000000 + 1) + '.webp'
      fs.writeFileSync(pathFile, bufferImage)
      await execPromise(`convert ${pathFile} ${pathFile}.gif`)
      await execPromise(`ffmpeg -i ${pathFile}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${pathFile}.mp4`)
      if (!fs.existsSync(pathFile + '.gif') || !fs.existsSync(pathFile + '.mp4')) {
         throw new Error('Failed convert file!')
      }
      let videoBuffer = fs.readFileSync(pathFile + '.mp4')
      fs.unlinkSync(pathFile)
      fs.unlinkSync(pathFile + '.gif')
      fs.unlinkSync(pathFile + '.mp4')
      return videoBuffer
   } catch (error) {
      throw error
   }
}