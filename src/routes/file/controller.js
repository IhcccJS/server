const path = require("path");

exports.upload = async function (ctx) {
  try {
    if (!ctx.request.files || !ctx.request.files.file) {
      ctx.send({ code: "fileError" });
      return;
    }
    const file = ctx.request.files.file.toJSON();
    const data = {
      name: file.newFilename.replace(/.+\//, ""),
      size: file.size,
      mime: file.mimetype,
    };

    data.url = file.filepath.replace(/.+\/public/, "");
    data.extname = path.extname(file.originalFilename).replace(".", "");
    data.type = data.mime.split("/")[0];

    ctx.send({ data });
  } catch (error) {
    console.log(error);
    ctx.send({ code: "error", error });
  }
};
