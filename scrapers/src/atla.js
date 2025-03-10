// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

const axios = require('axios');

class AltaPedia {
    constructor() {
        this.BASE_URL = 'https://atlantich2h.com';

        this.request = async (endpoint, apiKey, params) => {
            try {
                const response = await axios.post(
                    `${this.BASE_URL}${endpoint}`,
                    new URLSearchParams({
                        api_key: apiKey,
                        ...params
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                return response.data;
            } catch (error) {
                throw {
                    status: error.response?.status || 500,
                    message: error.response?.data?.message || error.message
                };
            }
        };

        this.deposit = async (apiKey, reffId, nominal, type, metode) => {
            return this.request('/deposit/create', apiKey, {
                reff_id: reffId,
                nominal,
                type,
                metode
            });
        };

        this.cancelDeposit = async (apiKey, id) => {
            return this.request('/deposit/cancel', apiKey, {
                id
            });
        };

        this.getDepositStatus = async (apiKey, id) => {
            return this.request('/deposit/status', apiKey, {
                id
            });
        };

        this.order = async (apiKey, code, reffId, target) => {
            return this.request('/order', apiKey, {
                code,
                reff_id: reffId,
                target
            });
        };

        this.getOrderStatus = async (apiKey, id, type) => {
            return this.request('/order/status', apiKey, {
                id,
                type
            });
        };

        this.getPriceList = async (apiKey, type) => {
            return this.request('/layanan/price_list', apiKey, {
                type
            });
        };

        this.getProfile = async (apiKey) => {
            return this.request('/get_profile', apiKey, {});
        };
    }
}

module.exports = new AltaPedia();