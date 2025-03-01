const axios = require('axios');
const cheerio = require('cheerio');

const checkHost = {
    api: {
        base: 'https://check-host.net',
        timeout: 30000,
        retries: 5
    },
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Postify/1.0.0'
    },
    types: ['ping', 'http', 'tcp', 'udp', 'dns', 'info'],

    hostname: (host) => {
        const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$|^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(host);
    },

    domain: (input) => {
        if (input.startsWith('http://') || input.startsWith('https://')) {
            return new URL(input).hostname;
        }
        return input;
    },

    flagEmoji: (cc) => {
        const codePoints = cc.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    },

    request: async (endpoint, params = {}) => {
        try {
            const { data } = await axios.get(`${checkHost.api.base}/${endpoint}`, {
                params,
                headers: checkHost.headers,
                timeout: checkHost.api.timeout
            });
            return data;
        } catch (error) {
            console.error(`${error.message}`, error.response?.data);
            throw error;
        }
    },

    check: async (host, type = 'ping', params = {}) => {
        if (!host || host.trim() === '') {
            return { status: false, message: 'Lah, hostnya mana bree? 🗿' };
        }

        if (!checkHost.types.includes(type)) {
            return { status: false, message: `Yaelah, tipe checknya nggak ada bree. Pilih salah satu dari ini: ${checkHost.types.join(', ')}` };
        }

        const hostx = checkHost.domain(host);
        if (!checkHost.hostname(hostx)) {
            return { status: false, message: 'Masukin input yang bener bree 🗿' };
        }

        try {
            const response = await checkHost.request(`check-${type}`, { host: hostx, ...params });
            return { status: true, data: response };
        } catch (error) {
            return { status: false, message: `${error.message}` };
        }
    }
};

module.exports = {
    command: "checkhost",
    alias: ["cekhost"],
    category: ["tools"],
    settings: {},
    description: "Mengecek host berdasarkan website",
    async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
        if (!m.args[0]) {
            return m.reply(`Mana host/domain nya??

Cara pakai:
${m.predix}${m.command} host type
${m.prefix}${m.command} host type port/record

Tipe yang tersedia:
• ping
• http
• tcp (+ port)
• udp (+ port)
• dns (+ record type)
• info

Contoh:
${m.prefix}${m.command} google.com ping
${m.prefix}${m.command} google.com tcp 80
${m.prefix}${m.command} google.com dns A`);
        }

        let [host, type = 'ping', param] = m.args;
        let params = {};

        if (type === 'tcp' || type === 'udp') {
            params.port = param || '80';
        } else if (type === 'dns') {
            params.type = param || 'A';
        }

        try {
            m.reply('Sabar ya, lagi ngecek...');
            const result = await checkHost.check(host, type, params);

            if (!result.status) {
                return m.reply(result.message);
            }

            let txt = `📡 *CHECK HOST*\n📍 Host: ${host}\n🔎 Type: ${type}\n\n`;
            txt += JSON.stringify(result.data, null, 2);
            m.reply(txt);
        } catch (error) {
            console.error(error);
            m.reply('Waduh error nih! Coba lagi nanti ya');
        }
    }
};