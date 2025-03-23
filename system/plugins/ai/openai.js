// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require("axios");

async function cetgepete(text) {
    let payload = {
        messages: [{
            content: text,
            role: "user"
        }]
    };

    try {
        let {
            data
        } = await axios.post("https://ai.riple.org/", payload, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            responseType: "stream"
        });

        return new Promise((resolve, reject) => {
            let fullResponse = "";

            data.on("data", (chunk) => {
                let lines = chunk.toString().split("\n");

                for (let line of lines) {
                    if (line.startsWith("data: ")) {
                        let jsonString = line.slice(6).trim();

                        if (jsonString === "[DONE]") {
                            return resolve(fullResponse.trim());
                        }

                        try {
                            let parsedData = JSON.parse(jsonString);
                            let content = parsedData?.choices?.[0]?.delta?.content;

                            if (content) {
                                fullResponse += content;
                            }
                        } catch (err) {
                            reject(err);
                        }
                    }
                }
            });

            data.on("error", (err) => reject(err));
        });

    } catch (error) {
        throw new Error(error.message);
    }
}

class Command {
    constructor() {
        this.command = "ai";
        this.alias = ["openai", "gpt", "gpt4"];
        this.category = ["ai"];
        this.settings = {};
        this.description = "bertanya kepada eai";
        this.loading = true;
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        text,
        store
    }) => {
    if (!text) return m.reply("Masukan pertanyaan anda");
    let data = await cetgepete(text);
    await m.reply(data);
    };
}

module.exports = new Command();