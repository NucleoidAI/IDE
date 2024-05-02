import appConfig from "./config.js";
/* eslint-disable */
import { defineConfig } from "cypress";

const config = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  video: true,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: `http://localhost:5173/${appConfig.base || ""}`,
  },
});

export default config;
/* eslint-enable */
