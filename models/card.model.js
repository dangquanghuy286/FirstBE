const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_Id: String,
    product: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Carts = mongoose.model("Carts", cartSchema, "carts");

module.exports = Carts;
