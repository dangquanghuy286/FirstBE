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
