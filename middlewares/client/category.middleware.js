const { createTree } = require("../../helpers/createTree");
const ProductCategory = require("../../models/productCategory.model");
module.exports.category = async (req, res, next) => {
  const productCategory = await ProductCategory.find({
    deleted: false,
  });
  const newRecord = createTree(productCategory);
  res.locals.records = newRecord;
  next();
};
