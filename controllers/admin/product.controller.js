const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const pagination = require("../../helpers/pagination");
// Load biến môi trường từ file .env
require("dotenv").config();
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

  //SOFT
  let sort = {};
  // Kiểm tra nếu người dùng truyền cả sortKey và sortValue qua query string
  if (req.query.sortKey && req.query.sortValue) {
    // Gán key và value vào object sort (ví dụ: { price: "asc" } hoặc { name: "desc" })
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    // Nếu không có thông tin sắp xếp, mặc định sắp xếp theo 'position' giảm dần (desc)
    sort.position = "desc";
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
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
  req.flash("success", "Cập nhật thành công!");
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
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm!`);
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
        }
      );
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm!`);
      break;
    case "deleteAll":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deleteDate: new Date(),
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);

      break;
    case "changePosition":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
        req.flash(
          "success",
          `Thay đổi vị trí thành công ${ids.length} sản phẩm!`
        );
      }

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
//[DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    { deleted: true, deleteDate: new Date() }
  );
  req.flash("success", `Xóa thành công sản phẩm với id ${id}!`);
  res.redirect(req.get("referer") || "/admin/products");
};
//[GET] /admin/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    tinymceApiKey: process.env.TINYMCE_API_KEY,
  });
};
//[POST] /admin/create
module.exports.createItem = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // req.body.thumbnail = `/uploads/${req.file.filename}`;
  const product = new Product(req.body);
  await product.save();
  req.flash("success", `Thêm sản phẩm thành công !`);
  res.redirect("/admin/products");
};

//[GET]/admin/products/edit/:id
module.exports.viewEdit = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const product = await Product.findOne(find);
  res.render("admin/pages/products/edit", {
    product: product,
    tinymceApiKey: process.env.TINYMCE_API_KEY,
  });
};
//[PATCH]/admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  try {
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", `Cập nhật sản phẩm thành công !`);
  } catch (error) {
    req.flash("error", `Cập nhật sản phẩm thất bại !`);
  }

  res.redirect("/admin/products");
};

//[GET]/admin/products/detail/:id
module.exports.detail = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  const product = await Product.findOne(find);
  res.render("admin/pages/products/detail", {
    product: product,
  });
};
