const Account = require("../../models/account.model");
// [GET] /admin/accounts
module.exports.account = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find);
  res.render("admin/pages/account/index", {
    title: "Account",
    records: records,
  });
};
// [GET] /admin/accounts
module.exports.create = async (req, res) => {
  res.render("admin/pages/account/create", {
    title: "Create Account",
  });
};
// [POST] /admin/accounts
module.exports.createPost = async (req, res) => {
  const records = new Account(req.body);
  await records.save();
  res.redirect(req.get("referer") || "/admin/accounts");
};
