/* eslint-disable */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
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
/* eslint-enable */
