const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const pagination = require("../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  // Filter
  const filterStatus = filterStatusHelper(req.query);
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Search

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = pagination(
    {
      limit: 10,
      currentPage: 1,
    },
    req.query,
    countProducts
  );
  //End Pagination

  const products = await Product.find(find)
    .limit(objectPagination.limit)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    title: "Product Management",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  res.redirect(req.get("referer") || "/admin/products");
};
//[PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
        }
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
        }
      );
      break;

    default:
      break;
  }
  res.redirect(req.get("referer") || "/admin/products");
};

// //[DELETE] /admin/product/delete/:id
// module.exports.deleteItem = async (req, res) => {
//   const id = req.params.id;
//   await Product.deleteOne({ _id: id });
//   res.redirect(req.get("referer") || "/admin/products");
// };

//Xóa mềm(có thể khôi phục)
//
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    { deleted: true, deleteDate: new Date() }
  );
  res.redirect(req.get("referer") || "/admin/products");
};
