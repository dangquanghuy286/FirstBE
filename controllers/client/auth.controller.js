const md5 = require("md5");
const User = require("../../models/user.model");

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
