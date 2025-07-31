const ProductCategory = require("../models/productCategory.model");

// Hàm xuất ra để dùng chung, nhận vào một parenId (ID danh mục cha)
module.exports.getSubcategory = async (parenId) => {
  // Hàm đệ quy nội bộ để tìm tất cả danh mục con của một danh mục cha
  const getSubCategory = async (parentId) => {
    // Tìm tất cả danh mục con trực tiếp của danh mục cha truyền vào
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active", // Chỉ lấy các danh mục đang hoạt động
      deleted: false, // Bỏ qua các danh mục đã bị xóa mềm
    });

    // Khởi tạo mảng chứa tất cả danh mục con tìm được ở cấp hiện tại
    let allSubs = [...subs];

    // Duyệt qua từng danh mục con tìm được để tiếp tục truy vấn sâu hơn (đệ quy)
    for (const sub of subs) {
      const child = await getSubCategory(sub.id); // Gọi lại chính hàm này để lấy danh mục con của sub hiện tại
      allSubs = allSubs.concat(child); // Gộp kết quả vào mảng kết quả tổng
    }

    // Trả về toàn bộ danh mục con (bao gồm mọi cấp độ)
    return allSubs;
  };

  // Gọi hàm đệ quy với ID danh mục cha gốc truyền vào
  const result = await getSubCategory(parenId);

  // Trả về danh sách danh mục con cuối cùng
  return result;
};
