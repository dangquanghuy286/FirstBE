const ProductCategory = require("../../models/productCategory.model");

// [GET] /admin/categories-product
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const products = await ProductCategory.find(find);

  res.render("admin/pages/productsCategory/index", {
    title: "Category",
    products: products,
  });
};
// [GET] /admin/categories-product
module.exports.create = async (req, res) => {
  res.render("admin/pages/productsCategory/create", {
    title: " Create Category",
  });
};
//[POST] /admin/categories-product/create
module.exports.createItem = async (req, res) => {
  // Tự động tăng position
  if (req.body.position == "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Lưu vô database
  const product = new ProductCategory(req.body);
  await product.save();
  res.redirect("/admin/categories-product");
};
