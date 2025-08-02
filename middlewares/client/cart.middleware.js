const Carts = require("../../models/card.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Carts();
    await cart.save();
    const date = 1000 * 60 * 60 * 24 * 365;

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + date),
      httpOnly: true,
    });
  }
  next();
};
