const controller = require("./controller");

function register(router) {
  router.post("/file/upload", controller.upload);
}

module.exports = register;
