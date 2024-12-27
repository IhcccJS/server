const Koa = require("koa");
const { koaBody } = require("koa-body");

const dataValidate = require("./middlewares/data-validate");
const response = require("./middlewares/response");
const router = require("./routes/init");
const { getFormidableOptions } = require("./utils/utils");

const GB = 1024 * 1024 * 1024;

const app = new Koa();

const onUploadError = (error) => {
  app.status = 400;
  app.body = { code: -1, msg: "上传失败", data: error };
};

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    // encoding: 'gzip', // 编码格式
    formidable: Object.assign(
      {
        maxFileSize: 1 * GB, // 上传文件最大限制
        onError: onUploadError,
      },
      getFormidableOptions({
        // 上传目录
        uploadDir: "../public/upload",
        // 动态子目录名称
        dynamicDir: () => new Date().toJSON().substring(0, 7),
      })
    ),
  })
);
app.use(dataValidate());
app.use(response);

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
