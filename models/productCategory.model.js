const mongoose = require("mongoose");
const slugify = require("slugify");

const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
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

// Middleware tạo slug trước khi lưu vào database và đảm bảo duy nhất
productCategorySchema.pre("save", async function (next) {
  // Chỉ xử lý khi title bị thay đổi hoặc khi slug chưa có
  if (!this.isModified("title")) return next();
  // Chuyen Title thanh slug
  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let count = 0;

  // Kiểm tra và tạo slug duy nhất
  while (await this.constructor.findOne({ slug })) {
    count++;
    slug = `${baseSlug}-${count}`;
  }

  this.slug = slug;
  next();
});

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema,
  "productCategory"
);

module.exports = ProductCategory;
