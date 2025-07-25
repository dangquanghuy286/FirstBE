const systemConfig = require("../../config/system");

const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategory = require("./productCategory.route");
const role = require("./role.route");

module.exports = (app) => {
  app.use(`${systemConfig.prefixAdmin}/dashboard`, dashboardRoute);
  app.use(`${systemConfig.prefixAdmin}/products`, productRoute);
  app.use(`${systemConfig.prefixAdmin}/categories-product`, productCategory);
  app.use(`${systemConfig.prefixAdmin}/roles`, role);
};
