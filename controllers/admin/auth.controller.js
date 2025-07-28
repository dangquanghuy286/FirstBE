const Account = require("../../models/account.model");
var md5 = require("md5");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", { title: "Login" });
};
// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const user = await Account.findOne({
    userName: userName,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `User name không đúng hoặc tồn tại!`);
    res.redirect(req.get("referer") || "/admin/auth/login");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", `Mật khẩu không đúng!`);
    res.redirect(req.get("referer") || "/admin/auth/login");
    return;
  }
  if (user.status != "active") {
    req.flash("error", `Tài khoản đã bị khóa !`);
    res.redirect(req.get("referer") || "/admin/auth/login");
    return;
  }
  res.cookie("token", user.token);
  res.redirect("/admin/dashboard");
};
// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/auth/login");
};
