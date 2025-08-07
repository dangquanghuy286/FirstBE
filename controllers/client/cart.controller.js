const Carts = require("../../models/card.model");
const Product = require("../../models/product.model");
// [GET] cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Carts.findOne({
    _id: cartId,
  });

  let totalPrice = 0;

  if (cart && cart.product.length > 0) {
    for (const item of cart.product) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");

      // Gắn thông tin sản phẩm vào item
      item.productInfo = productInfo;

      // Tính tổng tiền
      if (productInfo && productInfo.discountPercentage) {
        const discountedPrice =
          productInfo.price * (1 - productInfo.discountPercentage / 100);
        totalPrice += Math.round(discountedPrice * item.quantity);
      }
    }
  }

  res.render("client/pages/cart/index", {
    title: "Cart",
    cartItems: cart,
    totalPrice: totalPrice,
  });
};

//[POST] cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Carts.findOne({ _id: cartId });
  if (!cart) {
    req.flash("error", "Giỏ hàng không tồn tại!");
    return res.redirect(req.get("referer") || "/");
  }

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
// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  await Carts.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { product: { product_id: productId } },
    }
  );
  req.flash("success", "Xóa thành công!");
  res.redirect(req.get("referer"));
};
// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  await Carts.updateOne(
    {
      _id: cartId,
      "product.product_id": productId,
    },
    {
      $set: {
        "product.$.quantity": quantity,
      },
    }
  );
  req.flash("success", "Xóa thành công!");
  res.redirect(req.get("referer"));
};
