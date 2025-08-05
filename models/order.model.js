const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // user_id: { type: String, required: true }, // ID người dùng
    cart_id: { type: String }, // ID giỏ hàng nếu có

    userInfo: {
      fullName: { type: String, required: true }, // Họ và tên
      phone: { type: String, required: true }, // Số điện thoại
      email: { type: String }, // Email (tùy chọn)
      address: { type: String, required: true }, // Địa chỉ đầy đủ
    },

    shippingMethod: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "bank-transfer", "momo", "vnpay"],
      default: "cod",
    },

    note: { type: String }, // Ghi chú thêm
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    products: [
      {
        product_id: { type: String, required: true },
        price: { type: Number, required: true },
        discountPercentage: { type: Number, default: 0 },
        quantity: { type: Number, required: true },
      },
    ],

    shippingFee: { type: Number, default: 30000 }, // Phí vận chuyển mặc định
    couponCode: { type: String }, // Mã giảm giá nếu có
    discountAmount: { type: Number, default: 0 }, // Số tiền giảm giá
    totalPrice: { type: Number, required: true }, // Tổng tiền cuối cùng

    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", orderSchema, "orders");

module.exports = Orders;
