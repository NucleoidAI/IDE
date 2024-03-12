import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../../config.js";
import { publish } from "@nucleoidjs/react-event";

const instance = axios.create({
  baseURL: config.expert,
});

axiosRetry(instance, { retries: 3 });
axios.defaults.headers.common["Content-Type"] = "application/json";

instance.interceptors.response.use(
  () => {},
  (err) => {
    if (err.response.status === 500) {
      publish("GLOBAL_MESSAGE", {
        status: true,
        message: err.message,
        severity: "error",
      });
    }

    return Promise.reject(err);
  }
);

export default instance;
