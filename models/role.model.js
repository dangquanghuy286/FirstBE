const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permission: {
      type: Array,
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteDate: Date,
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
