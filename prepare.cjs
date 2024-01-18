const fs = require("fs");

fs.copyFileSync(
  `${__dirname}/scripts/pre-push.js`,
  `${__dirname}/.git/hooks/pre-push`
);
