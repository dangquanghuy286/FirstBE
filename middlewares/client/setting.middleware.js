const Setting = require("../../models/setting.model");

module.exports.settingGeneral = async (req, res, next) => {
  try {
    const settingGeneral = await Setting.findOne({});
    res.locals.settingGeneral = settingGeneral; // Sử dụng res.locals
    next();
  } catch (err) {
    next(err); // Chuyển lỗi sang middleware xử lý lỗi
  }
};
