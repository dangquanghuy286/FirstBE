const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Không hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == req.query.status
    );
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }

  const products = await Product.find(find);

  res.render("admin/pages/products/index", {
    title: "Product Management",
    products: products,
    filterStatus: filterStatus,
  });
};
