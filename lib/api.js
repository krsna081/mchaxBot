const axios = require("axios");

class APIManager {
  constructor() {
    this.APIs = {
      agatz: { baseURL: "https://api.agatz.xyz" },
      agung: { baseURL: "https://api.agungny.my.id" },
      apizell: { baseURL: "https://apizell.web.id/random" },
      archive: { baseURL: "https://archive-ui.tanakadomp.biz.id" },
      bk9: { baseURL: "https://bk9.fun" },
      delirius: { baseURL: "https://delirius-apiofc.vercel.app" },
      diibot: { baseURL: "https://api.diioffc.web.id" },
      fast: { baseURL: "https://fastrestapis.fasturl.cloud" },
      hiuraa: { baseURL: "https://api.hiuraa.my.id" },
      nyxs: { baseURL: "https://api.nyxs.pw" },
      otinxsandip: { baseURL: "https://sandipbaruwal.onrender.com" },
      mchax: { baseURL: "https://restapi.krizz.my.id" },
      siputzx: { baseURL: "https://api.siputzx.my.id" },
      vapis: { baseURL: "https://vapis.my.id" },
      velyn: { baseURL: "https://www.velyn.biz.id" },
    };
  }

  async get(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    try {
      const api = this.APIs[apiNameOrURL];

      if (!api) {
        const url = new URL(apiNameOrURL);
        apiNameOrURL = url;
      }

      const queryParams = new URLSearchParams(params);

      if (apiKeyParamName && api && "APIKey" in api) {
        queryParams.set(apiKeyParamName, api.APIKey);
      }

      const baseURL = api ? api.baseURL : apiNameOrURL.origin;
      const apiUrl = new URL(endpoint, baseURL);
      apiUrl.search = queryParams.toString();

      console.log("Fetching:", apiUrl.toString());

      const response = await axios.get(apiUrl.toString());
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      return null;
    }
  }

  listUrl() {
    return this.APIs;
  }
}

module.exports = APIManager;
