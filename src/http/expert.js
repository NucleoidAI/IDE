import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../../config.js";
import { publish } from "@nucleoidai/react-event";

const instance = axios.create({
  baseURL: config.expert,
});

axiosRetry(instance, { retries: 0 });
axios.defaults.headers.common["Content-Type"] = "application/json";

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response || err.response.status === 500) {
      publish("APP_MESSAGE", {
        message: err.message,
        severity: "error",
      });

      return Promise.resolve(err.message);
    } else {
      return Promise.reject(err);
    }
  }
);

export default instance;
