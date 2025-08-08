const Carts = require("../../models/card.model");

module.exports.cartId = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      // Chưa có cookie -> tạo mới giỏ hàng
      const cart = new Carts({ product: [] });
      await cart.save();

      const oneYear = 1000 * 60 * 60 * 24 * 365;
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + oneYear),
        httpOnly: true,
      });
    } else {
      // Có cookie -> tìm giỏ hàng
      let cart = await Carts.findById(req.cookies.cartId);

      // Nếu không tìm thấy -> tạo mới
      if (!cart) {
        cart = new Carts({ product: [] });
        await cart.save();

        const oneYear = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart.id, {
          expires: new Date(Date.now() + oneYear),
          httpOnly: true,
        });
      }

      // Tính tổng số lượng sản phẩm
      cart.totalQuantity = cart.product.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Gửi dữ liệu mini cart xuống view
      res.locals.miniCart = cart;
    }

    next();
  } catch (err) {
    next(err);
  }
};
