const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyRight: String,
    socialLinks: {
      facebook: String,
      tiktok: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema, "setting-general");

module.exports = Setting;
