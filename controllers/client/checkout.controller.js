const Carts = require("../../models/card.model");
const Orders = require("../../models/order.model");
const Product = require("../../models/product.model");

// [GET] checkout/
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

  res.render("client/pages/checkout/index", {
    title: "Checkout",
    cartItems: cart,
    totalPrice: totalPrice,
  });
};
// [post] checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Carts.findOne({
    _id: cartId,
  });

  const shippingFee =
    userInfo.shipping === "express"
      ? 50000
      : userInfo.shipping === "same-day"
      ? 80000
      : 30000;

  const products = [];
  for (const product of cart.product) {
    const obj = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    });
    obj.price = productInfo.price;
    obj.discountPercentage = productInfo.discountPercentage;
    products.push(obj);
  }
  // Tính tổng giá sản phẩm
  const subtotal = products.reduce((sum, product) => {
    const discountedPrice =
      product.price * (1 - product.discountPercentage / 100);
    return sum + discountedPrice * product.quantity;
  }, 0);
  const totalPrice = subtotal + shippingFee;
  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
    shippingFee, // Bây giờ biến này đã được định nghĩa
    shippingMethod: userInfo.shipping || "standard",
    paymentMethod: userInfo.payment || "cod",
    note: userInfo.note || "",
    status: "pending",
    totalPrice: totalPrice,
  };

  const order = new Orders(orderInfo);
  await order.save(); // Thêm await để đảm bảo order được save trước khi tiếp tục

  await Carts.updateOne(
    {
      _id: cartId,
    },
    {
      product: [],
    }
  );

  req.flash("success", "Thanh toán thành công!");
  res.redirect(`/checkout/success/${order._id}`);
};
// [GET] checkout/success/:id
module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  const order = await Orders.findOne({
    _id: orderId,
  });
  if (!order) {
    req.flash("error", "Đơn hàng không tồn tại!");
    return res.redirect("/checkout");
  }
  for (const product of order.products) {
    product.productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail slug price discountPercentage");
  }

  res.render("client/pages/checkout/success", {
    title: "Success",
    order: order,
  });
};
