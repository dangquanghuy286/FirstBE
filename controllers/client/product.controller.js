const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  res.render("client/pages/product/index", {
    title: "Products",
    products,
  });
};

// [GET]/products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const productDetail = await Product.findOne(find);

    if (!productDetail) {
      return res.status(404).render("client/pages/errors/404");
    }

    res.render("client/pages/product/detail", {
      product: productDetail,
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    res.status(500).render("client/pages/errors/500");
  }
};
