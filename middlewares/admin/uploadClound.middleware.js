const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Load biến môi trường từ file .env
require("dotenv").config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware để upload file ảnh lên Cloudinary
module.exports.uploadCloud = async (req, res, next) => {
  // Kiểm tra nếu có file mới được đính kèm trong request (thường từ multer)
  if (req.file) {
    // Hàm stream upload sử dụng Promise để xử lý bất đồng bộ
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        // Tạo stream upload lên Cloudinary
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          // Nếu thành công, resolve kết quả trả về
          if (result) {
            resolve(result);
          } else {
            // Nếu có lỗi, reject lỗi đó
            reject(error);
          }
        });

        // Đọc buffer từ file upload và pipe vào stream để tải lên Cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    try {
      // Chờ kết quả upload từ streamUpload
      let result = await streamUpload(req);
      // Lưu đường dẫn ảnh đã upload vào thuộc tính 'thumbnail' trong body request
      req.body.thumbnail = result.secure_url;
      req.body.avatar = result.secure_url;
      req.body.logo = result.secure_url;
    } catch (error) {
      // In lỗi ra console và trả về lỗi 500 nếu upload thất bại
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  }

  // Gọi middleware tiếp theo nếu không có lỗi
  next();
};
