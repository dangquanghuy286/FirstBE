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
// [GET] /admin/roles/edit:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Role.findOne(find);
    res.render("admin/pages/role/edit", {
      title: "Edit Role",
      data: data,
    });
  } catch (error) {
    res.redirect(req.get("referer") || "/admin/roles");
  }
};
// [PATCH] /admin/roles/edit:id
module.exports.editRole = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật nhóm quyền thành công!");
    res.redirect("/admin/roles");
  } catch (error) {
    console.error("Error updating category:", error);
    req.flash("error", "Cập nhật nhóm quyền thất bại!");
    res.redirect(`/admin/roles`);
  }
};
//[DELETE]/admin/roles/delete/:id(Tạm thời)
// module.exports.deletedRole = async (req, res) => {
//   const id = req.params.id;
//   await Role.updateOne(
//     {
//       _id: id,
//     },
//     {
//       deleted: true,
//       deleteDate: new Date(),
//     }
//   );
//   req.flash("success", `Xóa thành công vai trò với id ${id}!`);
//   res.redirect(req.get("referer") || "/admin/roles");
// };
//[DELETE]/admin/roles/delete/:id(Vĩnh viễn)
module.exports.deletedRole = async (req, res) => {
  const id = req.params.id;
  await Role.deleteOne({
    _id: id,
  });
  req.flash("success", `Xóa thành công vai trò với id ${id}!`);
  res.redirect(req.get("referer") || "/admin/roles");
};
