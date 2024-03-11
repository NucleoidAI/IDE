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
  (response) => {
    if (response.headers["content-type"] === "application/json") {
      response.data = JSON.parse(response.data);
    }
    return response;
  },
  async (error) => {
    if (error.response.status === 500) {
      if (error.response.data.error === "EXPERT_ERROR") {
        publish("EXPERT_ERROR_OCCURRED", {
          status: true,
          type: error.response.data.type,
          content: error.response.data.content,
        });
      } else {
        publish("GLOBAL_MESSAGE", {
          status: true,
          message: error.message,
          severity: "error",
        });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
