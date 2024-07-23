import axios from "axios";
import axiosRetry from "axios-retry";
import config from "../../config.js";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";

const instance = axios.create({
  baseURL: config.api,
});

const refreshAuthLogic = async (failedRequest) => {
  const refreshToken = storage.get("oauth.token")?.refreshToken;
  const accessToken = storage.get("oauth.token")?.accessToken;
  let tokenRefreshResponse;
  if (!refreshToken && !accessToken) {
    const code = await instance.getCodeFromGithub();
    tokenRefreshResponse = await instance.oauth({
      appId: config.id,
      code: code,
      redirect_uri: config.oauth.redirectUri,
    });
  } else {
    tokenRefreshResponse = await instance.oauth({ refreshToken: refreshToken });
  }
  storage.set("oauth.token", {
    accessToken: tokenRefreshResponse.accessToken,
    refreshToken: tokenRefreshResponse.refreshToken,
  });
  failedRequest.response.config.headers["Authorization"] =
    "Bearer " + tokenRefreshResponse.accessToken;
};

axiosRetry(instance, { retries: 3 });
createAuthRefreshInterceptor(instance, refreshAuthLogic);

instance.defaults.headers.common["Content-Type"] = "application/json";

instance.oauth = (body) =>
  fetch(config.oauth.accessTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    });

instance.getCodeFromGithub = () => {
  const popup = window.open(
    `${config.oauth.oauthUrl}?scope=user&client_id=${config.oauth.clientId}&redirect_uri=${config.oauth.redirectUri}`,
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

instance.getUserDetails = async () => {
  const refreshToken = storage.get("oauth.token")?.refreshToken;
  if (refreshToken) {
    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${refreshToken}`,
        },
      });
      return {
        name: response.data.login,
        avatarUrl: response.data.avatar_url,
        id: response.data.id,
      };
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      throw error;
    }
  }
  return null;
};

instance.interceptors.request.use((config) => {
  const token = storage.get("oauth.token")?.accessToken;
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response || err.response.status === 500) {
      publish("APP_MESSAGE", {
        message: err.message,
        severity: "error",
      });

      throw new Error(err.message);
    }
  }
);

export default instance;
