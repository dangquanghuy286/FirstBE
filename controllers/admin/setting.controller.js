const Setting = require("../../models/setting.model");

// [GET]/admin/setting/general
module.exports.settings = async (req, res) => {
  const setting = await Setting.findOne({});
  res.render("admin/pages/setting/general", {
    title: "Setting General",
    setting: setting,
  });
};
// [PATCH]/admin/setting/general
module.exports.updateSettings = async (req, res) => {
  const settingGeneral = await Setting.findOne({});
  if (settingGeneral) {
    await Setting.updateOne({ _id: settingGeneral._id }, req.body);
  } else {
    const setting = new Setting(req.body);
    await setting.save();
  }

  // Xử lý cập nhật cài đặt ở đây
  req.flash("success", "Cập nhật cài đặt thành công");
  res.redirect(req.get("referer"));
};
