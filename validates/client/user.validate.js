module.exports.registerPost = (req, res, next) => {
  if (!req.body.userName) {
    req.flash("error", "Vui long nhap userName");
    res.redirect(req.get("referer"));
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui long nhap email");
    res.redirect(req.get("referer"));
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui long nhap mat khau");
    res.redirect(req.get("referer"));
    return;
  }
  next();
};
module.exports.loginPost = (req, res, next) => {
  if (!req.body.userName) {
    req.flash("error", "Vui long nhap userName");
    res.redirect(req.get("referer"));
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui long nhap mat khau");
    res.redirect(req.get("referer"));
    return;
  }
  next();
};
module.exports.forgotPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui long nhap email");
    res.redirect(req.get("referer"));
    return;
  }

  next();
};
module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.newPassword) {
    req.flash("error", "Vui long nhap mat khau moi");
    res.redirect(req.get("referer"));
    return;
  }
  if (!req.body.confirmPassword) {
    req.flash("error", "Vui long nhap mat khau xac nhan");
    res.redirect(req.get("referer"));
    return;
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    req.flash("error", "Vui long nhap mat khau xac nhan");
    res.redirect(req.get("referer"));
    return;
  }

  next();
};
