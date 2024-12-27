const ruleFilter = function (fn) {
  return function (value, key) {
    if (value === void 0) return void 0;
    return fn(value, key);
  };
};

const defaultOptions = {
  required: function (value) {
    if (value === void 0 || value === "") return "不能为空！";
  },

  isString: ruleFilter(
    (value) => typeof value === "string" || "不是正确的字符类型！"
  ),

  isNumber: ruleFilter(
    (value) => /^\d+$/g.test(value) || "不是正确的数字类型！"
  ),

  isEmail: ruleFilter(
    (value) =>
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/g.test(
        value
      ) || "邮箱地址格式不正确！"
  ),

  isTelephone: ruleFilter(
    (value) => /1[2-9]\d{9}/g.test(value) || "手机号码格式不正确！"
  ),

  isUrl: ruleFilter(
    (value) =>
      /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/g.test(value) ||
      "URL地址格式不正确！"
  ),

  isPath: ruleFilter((value) => /^(\/\w)+/g.test(value) || "路径格式不正确！"),

  isBoolean: ruleFilter(
    (value) => /true|false/g.test(value) || "不是正确的布尔类型!"
  ),

  isDate: ruleFilter(
    (value) => /^(\d{4}-\d{1,2}-\d{1,2})$/g.test(value) || "不是正确的日期类型!"
  ),
};

// 处理数据检查
function validate(data, ruleConfig, options) {
  const error = {},
    passedData = {};

  for (const key in ruleConfig) {
    let value = data[key];
    // 如果是true、字符串、Symbol，就在有值时获取
    if (
      (ruleConfig[key] === true ||
        typeof ruleConfig[key] === "string" ||
        typeof ruleConfig[key] === "symbol") &&
      value !== void 0
    ) {
      passedData[key] = value;
    }
    // 如果是配置的对象，就检测校验数据
    else if (typeof ruleConfig[key] === "object") {
      // 接口的规则配置以及提示信息
      const fieldRules = ruleConfig[key].rules || [];
      const fieldTips =
        ruleConfig[key].tips === void 0 ? {} : ruleConfig[key].tips;
      const rename = ruleConfig[key].rename || key;
      // 如果没有值，则使用规则内的默认值
      if (value === void 0 || value === null) value = ruleConfig[key].value;
      if (ruleConfig[key].trim && value === "") value = void 0;
      for (let i = 0; i < fieldRules.length; i++) {
        const ruleName = fieldRules[i];
        if (Object.hasOwnProperty.call(options, ruleName)) {
          // 如果错误提示信息有此字段的提示信息了，此字段就不再进行校验
          if (Object.hasOwnProperty.call(error, key)) continue;
          // <---------------校验--------------->
          const ruleTip = options[ruleName](value, key);
          // 如果为假，或者是字符串，未通过校验
          if (ruleTip === false || typeof ruleTip === "string") {
            // 如果设置了重置，在检查出错时，不会添加提示信息
            if (!fieldTips) continue;
            if (typeof fieldTips[ruleName] === "string") {
              error[key] = { tip: fieldTips[ruleName], value };
            } else if (typeof fieldTips[ruleName] === "function") {
              error[key] = { tip: fieldTips[ruleName](value, key), value };
            } else {
              error[key] = { tip: ruleTip, value };
            }
          } else {
            passedData[rename] = value;
          }
        } else {
          throw new Error("options 上没有名为（" + ruleName + "）的校验方法！");
        }
      }
    }
  }

  if (Object.keys(error).length > 0) throw error;

  return passedData;
}

const dataValidate = (userOptions) => {
  const options = Object.assign(defaultOptions, userOptions);

  return async function (ctx, next) {
    if (!ctx.getQuery) {
      ctx.getQuery = function getQuery(rules) {
        return validate(ctx.query || {}, rules, options);
      };
    }
    if (!ctx.getBody) {
      ctx.getBody = function getBody(rules) {
        return validate(ctx.request.body || {}, rules, options);
      };
    }
    if (!ctx.getParams) {
      ctx.getParams = function getParams(rules) {
        let data = ctx.request.body;
        if (ctx.request.method === "GET") data = ctx.query;
        if (ctx.request.method === "DELETE") data = ctx.params;
        return validate(data || {}, rules, options);
      };
    }
    if (!ctx.validate) {
      ctx.validate = function validate(data, rules) {
        return validate(data, rules, options);
      };
    }

    await next();
  };
};

module.exports = dataValidate;
