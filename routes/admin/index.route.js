const systemConfig = require("../../config/system");
const authMid = require("../../middlewares/admin/auth.middleware");
const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategory = require("./productCategory.route");
const role = require("./role.route");
const account = require("./account.route");
const auth = require("./auth.route");
const myaccount = require("./myaccount.route");

module.exports = (app) => {
  app.use(
    `${systemConfig.prefixAdmin}/dashboard`,
    authMid.requireAuth,
    dashboardRoute
  );
  app.use(
    `${systemConfig.prefixAdmin}/products`,
    authMid.requireAuth,
    productRoute
  );
  app.use(
    `${systemConfig.prefixAdmin}/categories-product`,
    authMid.requireAuth,
    productCategory
  );
  app.use(`${systemConfig.prefixAdmin}/roles`, authMid.requireAuth, role);
  app.use(`${systemConfig.prefixAdmin}/accounts`, authMid.requireAuth, account);
  app.use(
    `${systemConfig.prefixAdmin}/my-account`,
    authMid.requireAuth,
    myaccount
  );
  app.use(`${systemConfig.prefixAdmin}/auth`, auth);
};
