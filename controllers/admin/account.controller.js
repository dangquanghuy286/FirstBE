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
// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    // Lấy thông tin tài khoản cần edit
    const account = await Account.findOne({
      _id: id,
      deleted: false,
    }).select("-password -token");

    if (!account) {
      req.flash("error", "Tài khoản không tồn tại!");
      return res.redirect("/admin/accounts");
    }

    // Lấy thông tin role của tài khoản
    const role = await Role.findOne({
      _id: account.roleId,
      deleted: false,
    });
    account.role = role;

    // Lấy danh sách tất cả roles
    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/account/edit", {
      title: "Edit Account",
      account: account,
      roles: roles,
    });
  } catch (error) {
    console.error("Lỗi khi load trang edit:", error);
    req.flash("error", "Có lỗi xảy ra khi tải trang!");
    res.redirect("/admin/accounts");
  }
};
// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

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
    res.redirect("/admin/accounts");
  } catch (error) {
    console.error("Lỗi cập nhật tài khoản:", error);
    req.flash("error", "Cập nhật tài khoản thất bại!");
    res.redirect("back");
  }
};
