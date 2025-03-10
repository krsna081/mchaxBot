// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

async function drive(url) {
    let id,
        res = {
            error: !0,
        };
    if (!url || !url.match(/drive\.google/i)) return res;
    try {
        if (
            ((id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]), !id)
        )
            throw "ID Not Found";
        res = await fetch(
            `https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
                method: "post",
                headers: {
                    "accept-encoding": "gzip, deflate, br",
                    "content-length": 0,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    origin: "https://drive.google.com",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                    "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
                    "x-drive-first-party": "DriveWebUi",
                    "x-json-requested": "true",
                },
            },
        );
        let {
            fileName,
            sizeBytes,
            downloadUrl
        } = JSON.parse(
            (await res.text()).slice(4),
        );
        if (!downloadUrl) throw "Link Download Limit!";
        let data = await fetch(downloadUrl);
        return 200 !== data.status ?
            data.statusText :
            {
                downloadUrl: downloadUrl,
                fileName: fileName,
                fileSize: Func.formatSize(sizeBytes),
                mimetype: data.headers.get("content-type"),
            };
    } catch (e) {
        return console.log(e), res;
    }
}

module.exports = drive;