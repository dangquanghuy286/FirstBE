// Preview Image
const uploadImg = document.querySelector("[upload-image]");
if (uploadImg) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const removeImage = document.querySelector("[remove-image]");
  const previewWrapper = document.querySelector(".image-preview-wrapper");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      previewWrapper.style.display = "flex";
    }
  });
  removeImage.addEventListener("click", (e) => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
    previewWrapper.style.display = "none";
  });
}

//Delete Item
const buttonDelete = document.querySelectorAll("[button-Delete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có muốn xóa!");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
