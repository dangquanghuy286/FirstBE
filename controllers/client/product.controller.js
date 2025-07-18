const product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const products = await product.find({
    status: "active",
    deleted: false,
  });

  res.render("client/pages/product/index", { products });
};
