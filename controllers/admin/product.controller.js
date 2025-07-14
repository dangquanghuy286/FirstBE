module.exports.index = (req, res) => {
  res.render("admin/pages/products/index", { title: "Product Management" });
};
