const Account = require("../../models/account.model");
var md5 = require("md5");
const Role = require("../../models/role.model");

// [GET] /admin/accounts
module.exports.account = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.roleId,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/account/index", {
    title: "Account",
    records: records,
  });
  console.log(records);
};
// [GET] /admin/accounts
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/account/create", {
    title: "Create Account",
    roles: roles,
  });
};
// [POST] /admin/accounts
module.exports.createPost = async (req, res) => {
  try {
    const emailExit = await Account.findOne({
      email: req.body.email,
      phone: req.body.phone,
      deleted: false,
    });

    if (emailExit) {
      req.flash("error", `Email hoặc số điện thoại đã tồn tại!`);
      res.redirect(req.get("referer") || "/admin/accounts.create");
    } else {
      req.body.password = md5(req.body.password);
      const records = new Account(req.body);
      await records.save();
      req.flash("success", `Tạo tài khoản thành công!`);
      res.redirect("/admin/accounts");
    }
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    req.flash("error", `Có lỗi xảy ra khi tạo tài khoản: ${error.message}`);
    res.redirect("/admin/accounts");
  }
};
