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

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked === inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
//End Checkbox Multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );
    const typeChange = e.target.elements.type.value;
    if (typeChange === "delete-all") {
      const isConfirm = confirm("Ban co muon xoa khong");
      if (!isConfirm) {
        return;
      }
    }
    if (inputChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "changePosition") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(",");

      formChangeMulti.submit();
    } else {
      alert("vui long chon");
    }
  });
}
