const ProductCategory = require("../../models/productCategory.model");
const createTree = require("../../helpers/createTree");
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
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const categoriesTree = createTree.createTree(records);

  res.render("admin/pages/productsCategory/create", {
    title: "Create Category",
    records: categoriesTree,
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

// [GET] /admin/categories-product/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const category = await ProductCategory.findById({ _id: id, deleted: false });
  const records = await ProductCategory.find({ deleted: false });
  const categoriesTree = createTree.createTree(records);
  res.render("admin/pages/productsCategory/edit", {
    title: "Edit Category",
    product: category,
    records: categoriesTree,
  });
};
// [PATCH] /admin/categories-product/edit/:id
module.exports.editItem = async (req, res) => {
  const id = req.params.id;
  try {
    // Xử lý position nếu có
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    }
    // Update database
    await ProductCategory.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật danh mục thành công!");
    res.redirect("/admin/categories-product");
  } catch (error) {
    console.error("Error updating category:", error);
    req.flash("error", "Cập nhật danh mục thất bại!");
    res.redirect(`/admin/categories-product`);
  }
};

// Xóa cứng
//[DELETE] /admin/product/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const id = req.params.id;
//   await ProductCategory.deleteOne({ _id: id });
//   res.redirect(req.get("referer") || "/admin/categories-product");
// };

// Xóa mềm(có thể khôi phục)
// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deleteDate: new Date() }
  );
  req.flash("success", `Xóa thành công sản phẩm với id ${id}!`);
  res.redirect(req.get("referer") || "/admin/categories-product");
};
