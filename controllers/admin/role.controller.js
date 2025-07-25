const Role = require("../../models/role.model");
// [GET] /admin/roles
module.exports.role = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/role/index", {
    title: "Role",
    records: records,
  });
};
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/role/create", {
    title: "Create Role",
  });
};
// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(req.get("referer") || "/admin/roles");
};
