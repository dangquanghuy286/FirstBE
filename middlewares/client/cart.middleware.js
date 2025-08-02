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
  } else {
    const cart = await Carts.findOne({
      _id: req.cookies.cartId,
    });

    cart.totalQuantity = cart.product.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    res.locals.miniCart = cart;
  }
  next();
};
