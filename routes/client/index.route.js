const category = require("../../middlewares/client/category.middleware");
const homeRoute = require("./home.route");
const productRoute = require("./product.route");

module.exports = (app) => {
  app.use(category.category);
  app.use("/", homeRoute);
  app.use("/products", productRoute);
};
