const md5 = require("md5");
const User = require("../../models/user.model");

// [GET]  /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đăng xuất thành công");
  res.redirect("/user/login");
};

// [GET]  /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/auth/login", {
    title: "Login",
  });
};
// [GET]  /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/auth/register", {
    title: "Register",
  });
};
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const exitEmail = await User.findOne({
    email: req.body.email,
  });
  if (exitEmail) {
    req.flash("error", "Email da ton tai");
    res.redirect(req.get("referer"));
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser, { maxAge: 900000, httpOnly: true });
  req.flash("success", "Dang ky thanh cong");
  res.redirect("/user/login");
  console.log(user);
};
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const user = req.body.userName;
    const password = req.body.password;

    // Tìm user theo userName
    const userLogin = await User.findOne({
      userName: user,
      deleted: false,
    });

    // Nếu không tìm thấy user
    if (!userLogin) {
      req.flash("error", "Tên đăng nhập không đúng");
      res.redirect(req.get("referer"));
      return;
    }

    // Kiểm tra mật khẩu
    if (md5(password) !== userLogin.password) {
      req.flash("error", "Mật khẩu không đúng");
      res.redirect(req.get("referer"));
      return;
    }

    if (userLogin.status !== "active") {
      req.flash("error", "Tài khoản của bạn đã bị khóa");
      res.redirect(req.get("referer"));
      return;
    }

    res.cookie("tokenUser", userLogin.tokenUser, {
      maxAge: 900000, // 15 phút
      httpOnly: true,
    });

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Có lỗi xảy ra trong quá trình đăng nhập");
    res.redirect(req.get("referer"));
  }
};
