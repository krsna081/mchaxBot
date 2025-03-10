const axios = require("axios");
const cheerio = require("cheerio");

async function krakenfiles(url) {
    return new Promise(async(resolve, reject) => {
         if (!/krakenfiles.com/.test(url)) return new Error("Input Url from Krakenfiles !")
         await axios.get(url).then(async(a) => {
           let $ = cheerio.load(a.data);
           let result = {
              metadata: {},
              buffer: null
          }
          result.metadata.filename = $(".coin-info .coin-name h5").text().trim();
          $(".nk-iv-wg4 .nk-iv-wg4-overview li").each((a, i) => {
              let name = $(i).find(".sub-text").text().trim().split(" ").join("_").toLowerCase()
              let value = $(i).find(".lead-text").text()
              result.metadata[name] = value
          })
         $(".nk-iv-wg4-list li").each((a, i) => {
              let name = $(i).find("div").eq(0).text().trim().split(" ").join("_").toLowerCase()
              let value = $(i).find("div").eq(1).text().trim().split(" ").join(",")
              result.metadata[name] = value
         })  
         result.metadata.thumbnail = "https:" + $("video").attr("poster");
         let downloads = "https:" + $("video source").attr("src");
         
         let res = await axios.get(downloads, {
              headers: {
               "User-Agent": "Posify/1.0.0",
               "Referer": "krakenfiles.com",
               "Accept": "krakenfile.com",
               "token": $("#dl-token").val()
             },
             responseType: "arraybuffer"
         }).catch(e => e.response);
         result.buffer = res.data
         resolve(result)
         }).catch((e) => {
              reject({
                  msg: "Failed to fetch data"
              })
         })
    })
}

//Usage : krakenfiles("https://krakenfiles.com/view/zeLYGa4X7f/file.html").then(a => console.log(a))

module.exports = krakenfiles
