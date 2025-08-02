const Carts = require("../../models/card.model");

//[POST] cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Carts.findOne({
    _id: cartId,
  });
  const exitPrd = cart.product.find((i) => i.product_id == productId);
  if (exitPrd) {
    const newPr = quantity + exitPrd.quantity;
    await Carts.updateOne(
      {
        _id: cartId,
        "product.product_id": productId,
      },
      {
        $set: {
          "product.$.quantity": newPr,
        },
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Carts.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { product: objectCart },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm thành công!");
  res.redirect(req.get("referer") || "/");
};
