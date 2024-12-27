const CODE = {
  success: ["0", "成功！"],
  error: ["-1", "失败！"],
  fileError: ["-2", "请选择文件！"],
};

async function responseCode(ctx, next) {
  ctx.send = function (result = {}) {
    const [code, message] = CODE[result.code || "success"];
    ctx.body = {
      message,
      ...result,
      code,
    };
  };
  await next();
}

module.exports = responseCode;
