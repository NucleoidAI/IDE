import Settings from "../settings.js";
import axios from "axios";
import config from "../../config.js";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { publish } from "@nucleoidjs/react-event";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  baseURL: config.api,
});

const oauth = (body) =>
  fetch(Settings.service.auth, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());

const getCodeFromGithub = () => {
  const popup = window.open(
    `https://github.com/login/oauth/authorize?scope=user&client_id=${Settings.github.client_id}`,
    "target_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=50,width=650,height=750"
  );

  return new Promise((resolve, reject) => {
    const timer = setInterval(function () {
      if (popup.closed) {
        clearInterval(timer);
        if (popup.location.href) {
          resolve(popup.location.href.split("?code=")[1]);
        } else {
          reject({ error: "POPUP_FORCE_CLOSED" });
        }
      }
    }, 700);
  });
};

const refreshAuthLogic = async (failedRequest) => {
  const refreshToken = storage.get("refreshToken");
  const accessToken = storage.get("accessToken");

  let tokenRefreshResponse;

  if (!refreshToken && !accessToken) {
    const code = await getCodeFromGithub();

    tokenRefreshResponse = await oauth({ code: code });
  } else {
    tokenRefreshResponse = await oauth({ refreshToken: refreshToken });
  }
  storage.set("accessToken", tokenRefreshResponse.accessToken);
  storage.set("refreshToken", tokenRefreshResponse.refreshToken);

  failedRequest.response.config.headers["Authorization"] =
    "Bearer " + tokenRefreshResponse.accessToken;
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

instance.interceptors.response.use((response) => {
  JSON.parse(response.data);
  return response;
});

instance.interceptors.response.use(
  (response) => {
    if (response.headers["content-type"] === "application/json") {
      response.data = JSON.parse(response.data);
    }
    return response;
  },
  async (error) => {
    const statusCode = error.response.status;

    if (statusCode === 500) {
      publish("GLOBAL_MESSAGE", {
        status: true,
        message: error.message,
        severity: "error",
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
