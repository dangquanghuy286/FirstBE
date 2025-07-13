const product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const products = await product.find({
    status: "active",
    deleted: false,
  });
  console.log(products);

  res.render("client/pages/product/index", { products });
};
