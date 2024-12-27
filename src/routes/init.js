const Router = require("@koa/router");
const file = require("./file");

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "<h1>服务已成功运行～</h1>";
});

file(router);

module.exports = router;
