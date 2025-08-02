const category = require("../../middlewares/client/category.middleware");
const cart = require("../../middlewares/client/cart.middleware");
const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");

module.exports = (app) => {
  app.use(category.category);
  app.use(cart.cartId);
  app.use("/", homeRoute);
  app.use("/products", productRoute);
  app.use("/search", searchRoute);
  app.use("/cart", cartRoute);
};
