var md5 = require("md5");
const Account = require("../../models/account.model");

// [GET] /admin/myaccount
module.exports.index = (req, res) => {
  res.render("admin/pages/myaccount/index", { title: "My Account" });
};
// [GET] /admin/myaccount/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/myaccount/edit", { title: "Edit My Account" });
};
// [GET] /admin/myaccount/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = res.locals.user.id;

    // Kiểm tra email hoặc số điện thoại đã tồn tại
    const emailExit = await Account.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
      _id: { $ne: id }, // Loại trừ tài khoản hiện tại
      deleted: false,
    });

    if (emailExit) {
      req.flash("error", `Email hoặc số điện thoại đã tồn tại!`);
      return res.redirect("back");
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật tài khoản thành công!");
    res.redirect("/admin/my-account");
  } catch (error) {
    console.error("Lỗi cập nhật tài khoản:", error);
    req.flash("error", "Cập nhật tài khoản thất bại!");
    res.redirect(req.get("referer"));
  }
};
