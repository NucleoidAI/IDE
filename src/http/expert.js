import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../../config.js";

const instance = axios.create({
  baseURL: config.expert,
});

axiosRetry(instance, { retries: 3 });
axios.defaults.headers.common["Content-Type"] = "application/json";

export default instance;
