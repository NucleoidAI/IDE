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
  },
});

export default config;
/* eslint-enable */
