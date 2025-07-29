const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookie.token) {
    res.redirect("/admin/auth/login");
  } else {
    const user = await Account.findOne({
      token: req.cookie.token,
    });
    if (!user) {
      res.redirect("/admin/auth/login");
    } else {
      next();
    }
  }
};
