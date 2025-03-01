const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

class Hentai {
    latest = async () => {
        try {
            const {
                data
            } = await axios.get("https://nhentai.net");
            const $ = cheerio.load(data);
            const res = [];

            $('.gallery').each((index, element) => {
                res.push({
                    title: $(element).find(".caption").text(),
                    url: "https://nhentai.net" + $(element).find('a').attr("href"),
                    thumb: $(element).find('.lazyload').attr("data-src"),
                });
            });

            return res;
        } catch (error) {
            console.error("Error fetching latest galleries:", error.message);
            return null;
        }
    };
    detail = async (url) => {
        try {
            const {
                data
            } = await axios.get(url);
            const $ = cheerio.load(data);
            const info = {
                title: $('.title .pretty').text() || $('.title .english').text() || $('.title .japanese').text(),
                uploaded: moment(new Date($('.tag-container.field-name:last-child time').attr('datetime'))).format("DD/MM/YYYY HH:mm"),
                images: [],
            };

            $('.thumb-container').each((index, element) => {
                info.images.push($(element).find(".lazyload").attr("data-src"));
            });

            return info;
        } catch (error) {
            console.error("Error fetching gallery details:", error.message);
            return null;
        }
    }
}

module.exports = new Hentai();