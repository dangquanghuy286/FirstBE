const Product = require("../../models/product.model");

// [GET]/search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if (keyword) {
    // Tạo một biểu thức chính quy (Regular Expression)
    // để tìm kiếm chuỗi có chứa 'keyword', không phân biệt chữ hoa chữ thường.
    const regex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: regex,
      deleted: false,
      status: "active",
    });
    newProducts = products;
  }
  res.render("client/pages/search/index", {
    title: "Searched",
    keyword: keyword,
    products: newProducts,
  });
};
