// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

/*
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require("axios");
const cheerio = require("cheerio");

class Otakudesu {
    constructor() {
        this.baseUrl = "https://otakudesu.cloud";
    }

    latest = async function latest() {
        try {
            const url = `${this.baseUrl}/ongoing-anime/`;
            const {
                data
            } = await axios.get(url);
            const $ = cheerio.load(data);

            let animeList = [];

            $(".venz ul li").each((i, elem) => {
                const title = $(elem).find("h2.jdlflm").text().trim();
                const episode = $(elem).find(".epz").text().replace("Episode ", "").trim();
                const releaseDay = $(elem).find(".epztipe").text().trim();
                const releaseDate = $(elem).find(".newnime").text().trim();
                const image = $(elem).find(".thumbz img").attr("src");
                const link = $(elem).find(".thumb a").attr("href");

                animeList.push({
                    title,
                    episode,
                    releaseDay,
                    releaseDate,
                    image,
                    link
                });
            });

            return animeList;
        } catch (error) {
            return {
                error: "Gagal mengambil data anime terbaru."
            };
        }
    }

    download = async function download(link) {
        try {
            const response = await axios.get(link);
            const $ = cheerio.load(response.data);
            const downanime = [];

            $('.episodelist ul li span a').each((index, element) => {
                downanime.push($(element).attr('href'));
            });

            return downanime;
        } catch (error) {
            console.error('Error fetching episode links:', error);
            return [];
        }
    }

    detail = async function detail(url) {
        try {
            const {
                data
            } = await axios.get(url);
            const $ = cheerio.load(data);

            const title = $('title').text().split('|')[0].trim();
            const description = $('meta[name="description"]').attr('content');
            const image = $('meta[property="og:image"]').attr('content');
            const publishedTime = $('meta[property="article:published_time"]').attr('content');
            const modifiedTime = $('meta[property="article:modified_time"]').attr('content');
            const titleJapanese = $('p:contains("Japanese")').text().replace('Japanese: ', '').trim();
            const score = $('p:contains("Skor")').text().replace('Skor: ', '').trim();
            const producer = $('p:contains("Produser")').text().replace('Produser: ', '').trim();
            const type = $('p:contains("Tipe")').text().replace('Tipe: ', '').trim();
            const status = $('p:contains("Status")').text().replace('Status: ', '').trim();
            const totalEpisodes = $('p:contains("Total Episode")').text().replace('Total Episode: ', '').trim();
            const duration = $('p:contains("Durasi")').text().replace('Durasi: ', '').trim();
            const releaseDate = $('p:contains("Tanggal Rilis")').text().replace('Tanggal Rilis: ', '').trim();
            const studio = $('p:contains("Studio")').text().replace('Studio: ', '').trim();
            const genres = $('p:contains("Genre") a').map((i, el) => $(el).text().trim()).get().join(', ');
            const synopsis = $('.sinopc p').map((i, el) => $(el).text().trim()).get().join(' ');
            const download = await this.download(url);

            const episodes = $('.episodelist ul li').map((i, el) => ({
                title: $(el).find('a').text().trim(),
                link: $(el).find('a').attr('href'),
                releaseDate: $(el).find('.zeebr').text().trim(),
            })).get();

            return {
                title,
                titleJapanese,
                description,
                image,
                publishedTime,
                modifiedTime,
                score,
                producer,
                type,
                status,
                totalEpisodes,
                duration,
                releaseDate,
                studio,
                genres,
                download,
                synopsis,
                episodes,
                url
            };
        } catch (error) {
            return {
                error: `Gagal mengambil data: ${error.message}`
            };
        }
    }

    search = async function search(query) {
        try {
            const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=anime`;
            const {
                data
            } = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const $ = cheerio.load(data);
            const results = [];

            $('.chivsrc > li').each((i, el) => {
                const image = $(el).find('img').attr('src');
                const title = $(el).find('h2 a').text().trim();
                const url = $(el).find('h2 a').attr('href');
                const genres = [];
                $(el).find('.set').eq(0).find('a').each((_, genre) => {
                    genres.push($(genre).text().trim());
                });
                const status = $(el).find('.set').eq(1).text().replace('Status :', '').trim();
                const rating = $(el).find('.set').eq(2).text().replace('Rating :', '').trim();

                if (title && url) {
                    results.push({
                        title,
                        url,
                        image,
                        genres,
                        status,
                        rating
                    });
                }
            });

            return results;
        } catch (error) {
            return {
                error: 'Gagal mengambil data, coba lagi nanti'
            };
        }
    }
}

module.exports = new Otakudesu();