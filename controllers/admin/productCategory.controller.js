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
  let find = {
    deleted: false,
  };

  // Hàm đệ quy để xây dựng cây từ mảng dữ liệu phẳng
  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item._id.toString());
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const records = await ProductCategory.find(find);
  const categoriesTree = createTree(records);

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
