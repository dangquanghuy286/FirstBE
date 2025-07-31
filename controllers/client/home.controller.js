const Product = require("../../models/product.model");

// [GET]/
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const featureProduct = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  console.log(featureProduct);

  res.render("client/pages/home/index", {
    title: "Home",
    featureProduct: featureProduct,
  });
};
