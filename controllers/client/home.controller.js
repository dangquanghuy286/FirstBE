const Product = require("../../models/product.model");

// [GET]/
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const featureProduct = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(4);

  //Lấy ra sản phẩm mới nhất
  const newProduct = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({
      position: "desc",
    })
    .limit(8);

  res.render("client/pages/home/index", {
    title: "Home",
    featureProduct: featureProduct,
    newProduct: newProduct,
  });
};
