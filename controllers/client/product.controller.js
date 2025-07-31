const Product = require("../../models/product.model");
const ProductCategory = require("../../models/productCategory.model");
const productHelper = require("../../helpers/categoryHelper");
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
      slug: req.params.slugCategory,
      status: "active",
    };

    const productDetail = await Product.findOne(find);

    if (!productDetail) {
      return res.status(404).render("client/pages/errors/404");
    }
    if (productDetail.productCategory_id) {
      const category = await ProductCategory.findOne({
        _id: productDetail.productCategory_id,
        status: "active",
        deleted: false,
      });
      productDetail.category = category;
    }
    res.render("client/pages/product/detail", {
      title: "Product",
      product: productDetail,
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    res.status(500).render("client/pages/errors/500");
  }
};
// [GET]/products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });

  // Gọi hàm để lấy toàn bộ danh mục con của danh mục chính
  const listsubCategory = await productHelper.getSubcategory(category.id);

  // Tạo mảng chỉ chứa id của tất cả danh mục con (để sử dụng trong truy vấn)
  const listsubId = listsubCategory.map((i) => i.id);

  // Tìm tất cả sản phẩm thuộc:
  // - danh mục chính (`category.id`) hoặc
  // - bất kỳ danh mục con nào (trong `listsubId`)
  const products = await Product.find({
    productCategory_id: { $in: [category.id, ...listsubId] }, // tìm trong mảng các id
    deleted: false, // chỉ lấy sản phẩm chưa bị xóa
  });

  res.render("client/pages/product/index", {
    title: "Product",
    products: products,
  });
};
