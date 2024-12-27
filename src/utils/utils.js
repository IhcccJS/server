const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

/**
 * 如果该路径不存在此文件夹，将创建文件夹
 * @param {string} dir 文件夹路径
 */
function mkDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

/**
 * 修改上传文件名称
 * @param {string} filename 文件名
 * @returns
 */
function fileName(filename, ext) {
  return [
    filename
      .substring(0, 24)
      .replace(/\s|[`~!@#$%^&*()|\-=?;:'",<>\{\}\\\/]/gi, "-"),
    "_",
    nanoid(6),
    ext,
  ].join("");
}

/**
 * ### 文件上传配置
 * @returns [配置项](https://github.com/node-formidable/formidable#options)
 */
function getFormidableOptions(options) {
  const { uploadDir, dynamicDir } = options || {};
  const uploadDirPath = path.join(__dirname, "../", uploadDir);
  let subDir = null;
  return {
    uploadDir: uploadDirPath, // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    filename: (name, ext) => {
      // 动态子目录名称
      const dir = dynamicDir?.();
      if (!!dir && dir !== subDir) {
        // 如果有子目录名称，并且和当前不一致
        const fileRootPath = path.join(uploadDirPath, dir);
        // 尝试创建这个可能不存在的子目录，并记录当前目录名称
        // 如果没有子目录名称，或者名称和当前一致，则不需要尝试创建
        mkDir(fileRootPath);
        subDir = dir;
      }
      const filename = fileName(name, ext);
      return !subDir ? filename : `${subDir}/${filename}`;
    },
  };
}

module.exports = {
  fileName,
  getFormidableOptions,
};
