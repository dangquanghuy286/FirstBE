// Lấy tất cả các nút có thuộc tính button-status (ví dụ: Tất cả, Hoạt động, Không hoạt động)
const buttonStatus = document.querySelectorAll("[button-status]");

// Kiểm tra nếu có ít nhất một nút được tìm thấy
if (buttonStatus.length > 0) {
  // Tạo đối tượng URL từ đường dẫn hiện tại của trang
  let url = new URL(window.location.href);

  // Lặp qua từng nút trong danh sách buttonStatus
  buttonStatus.forEach((button) => {
    // Gắn sự kiện click cho từng nút
    button.addEventListener("click", (e) => {
      // Lấy giá trị của thuộc tính button-status trên nút được nhấn
      const status = e.target.getAttribute("button-status");

      // Nếu có giá trị status (tức là không phải nút "Tất cả")
      if (status) {
        // Thêm hoặc cập nhật tham số truy vấn 'status' trong URL
        url.searchParams.set("status", status);
      } else {
        // Nếu không có giá trị (nút "Tất cả"), thì xóa tham số 'status' khỏi URL
        url.searchParams.delete("status");
      }

      // Chuyển hướng trình duyệt đến URL mới đã được cập nhật
      window.location.href = url.toString();
    });
  });
}

// FormSearch
const formSearch = document.querySelector("#formSearch");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value.trim();
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
