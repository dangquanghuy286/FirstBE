// [GET] /admin/dashboard
module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboard/index", { title: "Admin Dashboard" });
};
