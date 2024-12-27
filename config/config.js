const isdev = process.env.npm_lifecycle_event === "dev";

let config = require("./config.dev");

if (!isdev) {
  try {
    config = require("./config.prod");
  } catch (error) {}
}

module.exports = {
  ...config,
  isdev,
};
