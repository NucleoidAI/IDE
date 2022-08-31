module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ["eslint:recommended", "react-app", "react-app/jest", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  ignorePatterns: [
    "/node_modules",
    "/public/dist",
    "/src/dist",
    "/public/service-worker.js",
    "/src/defaultMap.js",
  ],
  rules: {
    eqeqeq: ["error", "always"],
    "no-console": "off",
    "no-eval": "error",
    "no-var": "error",
    "prefer-const": "error",
    "sort-imports": [
      "warn",
      {
        memberSyntaxSortOrder: ["none", "single", "multiple", "all"],
      },
    ],
  },
};
