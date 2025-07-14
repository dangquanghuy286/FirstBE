const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let keyword = "";

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.keyword) {
    keyword = req.query.keyword.trim(); //trim() la ham loai bo khoang trang
    const regex = new RegExp(keyword, "i"); //i là để không phân biệt chữ hoa chữ thường
    find.title = regex;
  }

  const products = await Product.find(find);

  res.render("admin/pages/products/index", {
    title: "Product Management",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
  });
};
