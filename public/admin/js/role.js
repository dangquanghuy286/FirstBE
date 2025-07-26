// Permission
// Tìm phần tử bảng có attribute [table-permissions]
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  // Tìm nút submit có attribute [button-submit]
  const buttonSubmit = document.querySelector("[button-submit]");

  // Gắn sự kiện click cho nút Cập nhật
  buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // Ngăn form submit mặc định

    let permissions = []; // Mảng chứa kết quả cuối cùng
    const rows = tablePermissions.querySelectorAll("[data-name]"); // Lấy tất cả các dòng có data-name

    // Duyệt qua từng dòng
    rows.forEach((item) => {
      const name = item.getAttribute("data-name"); // Lấy tên của dòng
      const inputs = item.querySelectorAll("input"); // Lấy tất cả các input trong dòng đó

      if (name == "id") {
        // Nếu là dòng chứa ID
        inputs.forEach((input) => {
          const id = input.value; // Lấy giá trị ID từ ô input
          // Tạo một object có cấu trúc { id: <id>, permissions: [] } và thêm vào mảng
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        // Các dòng còn lại là quyền (view, create, edit, delete)
        inputs.forEach((input, index) => {
          const checked = input.checked; // Kiểm tra ô checkbox có được tick hay không
          if (checked) {
            // Nếu có tick thì thêm tên quyền (name) vào danh sách quyền tương ứng với index
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    // In ra kết quả mảng permissions để kiểm tra
    console.log(permissions);

    // Kiểm tra và gửi dữ liệu
    if (permissions.length > 0) {
      const formChange = document.querySelector("[form-change-permissions]");
      const input = formChange.querySelector("input[name='permissions']");

      if (input) {
        input.value = JSON.stringify(permissions);
        // Submit form
        formChange.submit();
      } else {
        console.error("Không tìm thấy input có name='permissions'");
      }
    } else {
      console.warn("Không có dữ liệu permissions để gửi");
    }
  });
}
// End Permission

// Permission Data Default
// Lấy phần tử chứa dữ liệu records dưới dạng JSON trong attribute
const dataRecords = document.querySelector("[data-records]");

if (dataRecords) {
  // Parse chuỗi JSON thành mảng đối tượng
  const records = JSON.parse(dataRecords.getAttribute("data-records"));

  // Tìm bảng phân quyền
  const tablePermissions = document.querySelector("[table-permissions]");

  // Duyệt qua từng bản ghi (record)
  records.forEach((record, index) => {
    const permissions = record.permission; // Lấy danh sách quyền của record hiện tại

    // Duyệt từng quyền trong danh sách
    permissions.forEach((permission) => {
      // Tìm dòng tương ứng với tên quyền
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`);

      // Lấy tất cả input (checkbox) trong dòng đó
      const input = row.querySelectorAll("input")[index];

      // Đánh dấu checked ô checkbox tương ứng với người dùng đó
      input.checked = true;
    });
  });
}
// End Permission Data Default
