const axios = require("axios");
const cheerio = require("cheerio");
const fakeUa = require("fake-useragent");
const FormData = require("form-data");




class SoundCloud {
search = function search(query) {
return new Promise(async (resolve, reject) => {
try {
let res = await axios.get("https://proxy.searchsoundcloud.com/tracks?q="+query.replace(/ /g, "+"));
let final = res.data.collection.map((track) => ({
title: track.title,
author: track.user.username,
url: track.permalink_url,
artwork: track.artwork_url,
duration: millisecondsToTime(track.duration),
playback_count: formatNumber(track.playback_count),
total_likes: formatNumber(track.likes_count),
created_at: track.created_at,
}));
resolve({
status: true,
creator: "@krniwnstria",
result_count: final.length,
result: final,
});
} catch (error) {
reject({
status: false,
creator: "@krniwnstria",
message: error.message,
});
}
});
};


download = function download(url) {
return new Promise(async (resolve, reject) => {
try {
const { data } = await axios.get('https://soundcloudtool.com/', {
headers: {
"User-Agent": fakeUa(),
},
});
const $ = cheerio.load(data);
const token = $('input[name="csrfmiddlewaretoken"]').attr("value");
if (!token) throw new Error("CSRF token not found.");
const form = new FormData();
form.append("csrfmiddlewaretoken", token);
form.append("soundcloud", url);
const r = await axios.post("https://soundcloudtool.com/soundcloud-downloader-tool", form, {
headers: {
"User-Agent": fakeUa(),
...form.getHeaders(),
},
});
const $result = cheerio.load(r.data);
const link = $result('#trackLink').attr('href');
if (!link) throw new Error("Download link not found!");
resolve({
status: true,
creator: "@krniwnstria",
title: $result(".info p").text() || "Unknown Title",
cover: $result(".thumb.mb-4 img").attr("src") || "No Image",
url: link,
});
} catch (error) {
console.error(error);
reject({
status: false,
creator: "@krniwnstria",
message: error.message,
});
}
});
};
}

function millisecondsToTime(ms) {
let seconds = Math.floor(ms / 1000) % 60;
let minutes = Math.floor(ms / 60000) % 60;
let hours = Math.floor(ms / 3600000);
return (
(hours ? hours + ":" : "") +
(minutes < 10 && hours ? "0" : "") +
minutes +
":" +
(seconds < 10 ? "0" : "") +
seconds
);
}

function formatNumber(num) {
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = new SoundCloud();
